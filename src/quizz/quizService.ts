import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Quiz} from "./entities/quizz.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, TQuiz, TQuizForResponse} from "../GeneralResponse/interface/customResponces";
import {Answers} from "./entities/answers.entity";
import {Question} from "./entities/question.entity";
import {QuestionDto} from "./dto/question.dto";
import {AnswerDto} from "./dto/answer.dto";
import {Company} from "../company/entities/company.entity";
import {UpdateQuizDto} from "./dto/update-quizz.dto";
import * as process from "process";
import {PaginationsQuizDto} from "./dto/pagination-quiz.dto";
import {DeleteQuizDto} from "./dto/delete-quiz.dto";

@Injectable()
export class QuizService {
    private readonly logger: Logger = new Logger(QuizService.name);

    constructor(@InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
                @InjectRepository(Answers) private answersRepository: Repository<Answers>,
                @InjectRepository(Question) private questionRepository: Repository<Question>) {
    }

    async createQuiz(userFromGuard: User, createQuizDto: CreateQuizDto, companyFromGuard: Company): Promise<GeneralResponse<TQuiz>> {
        if (createQuizDto.questions.length < 2)
            throw new HttpException("You must add at least 2 questions", HttpStatus.BAD_REQUEST);
        createQuizDto.questions.some((question: QuestionDto) => {
            if (question.varsAnswers.length < 2)
                throw new HttpException("You must add at least 2 variants of answers", HttpStatus.BAD_REQUEST);
        });

        const newQuiz: Quiz = this.quizRepository.create({
            description: createQuizDto.description,
            frequencyInDay: createQuizDto.frequencyInDay,
            company: companyFromGuard,
        });
        const savedQuiz: Quiz = await this.quizRepository.save(newQuiz);

        for (const question of createQuizDto.questions) {
            const newQuestion: Question = this.questionRepository.create({
                questionText: question.questionText,
                rightAnswer: question.rightAnswer,
                varsAnswers: [],
                quiz: savedQuiz,
            });
            const savedNewQuestion: Question = await this.questionRepository.save(newQuestion);

            const arrPromisesAnswers: Promise<Answers>[] = question.varsAnswers.map((oneVariantAnswer: AnswerDto) => {
                const newVar: Answers = this.answersRepository.create({
                    varAnswer: oneVariantAnswer.varAnswer
                });
                return this.answersRepository.save(newVar);
            });
            const savedAnswers: Answers[] = await Promise.all(arrPromisesAnswers);
            /*adding relation in Question arr all answers*/
            savedNewQuestion.varsAnswers = savedAnswers;
            await this.questionRepository.save(savedNewQuestion);
        }

        this.logger.log(`User ${userFromGuard.email} created quiz ${createQuizDto}`);
        const quizResponseCuted: TQuizForResponse = {
            description: savedQuiz.description,
            frequencyInDay: savedQuiz.frequencyInDay,
            id: savedQuiz.id,
        }

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": quizResponseCuted,
            },
            "result": "created"
        };
    }

    async updateQuiz(userFromGuard: User, updateQuizDto: UpdateQuizDto): Promise<GeneralResponse<TQuiz>> {
        /*find needs quiz*/
        const quizToUpdate: Quiz | undefined = await this.quizRepository.findOne({
            where: {
                id: updateQuizDto.quizId,
                company: {id: updateQuizDto.companyId},
            },
            relations: ['questions', 'questions.varsAnswers'],
        });
        if (!quizToUpdate) throw new HttpException("Quiz not found", HttpStatus.NOT_FOUND);
        if (updateQuizDto.questions.length < 2)
            throw new HttpException("You must add at least 2 questions", HttpStatus.BAD_REQUEST);
        updateQuizDto.questions.some((question: QuestionDto) => {
            if (question.varsAnswers.length < 2)
                throw new HttpException("You must add at least 2 variants of answers", HttpStatus.BAD_REQUEST);
        });

        /*del old questions + answers */
        quizToUpdate.questions.forEach((question: Question) => {
            this.questionRepository.delete(question.id);
        });

        const newQuestions: Promise<Question>[] = updateQuizDto.questions.map(async (question: QuestionDto) => {
            const newQuestion: Question = this.questionRepository.create({
                questionText: question.questionText,
                rightAnswer: question.rightAnswer,
                varsAnswers: [],
            });
            const savedNewQuestion: Question = await this.questionRepository.save(newQuestion);

            /*before this applied all questionRepository changes this part code wait -await Promise.all(newQuestions) */
            const arrPromisesAnswers: Promise<Answers>[] = question.varsAnswers.map((oneVariantAnswer: AnswerDto) => {
                const newVar: Answers = this.answersRepository.create({
                    varAnswer: oneVariantAnswer.varAnswer,
                });
                return this.answersRepository.save(newVar);
            });

            const savedAnswers: Answers[] = await Promise.all(arrPromisesAnswers);
            /*adding relation - in Question arr all answers*/
            savedNewQuestion.varsAnswers = savedAnswers;
            await this.questionRepository.save(savedNewQuestion);
            return savedNewQuestion;
        });


        /*wait all relation question for quiz*/
        quizToUpdate.questions = await Promise.all(newQuestions);
        /*save relation question to quiz*/
        await this.quizRepository.save(quizToUpdate);

        this.logger.log(`User ${userFromGuard.email} created quiz ${quizToUpdate}`);
        const quizResponseCuted: TQuizForResponse = {
            description: quizToUpdate.description,
            frequencyInDay: quizToUpdate.frequencyInDay,
            id: quizToUpdate.id,
        }

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": quizResponseCuted,
            },
            "result": "updated"
        };

    }

    async deleteQuiz(userFromGuard: User, quizDeleteDTO: DeleteQuizDto): Promise<GeneralResponse<IDeleted>> {
        const quizToDelete: Quiz | undefined = await this.quizRepository.findOne({
            where: {id: quizDeleteDTO.quizId}
        });

        if (!quizToDelete) throw new HttpException("Quiz not found", HttpStatus.BAD_REQUEST);

        await this.quizRepository.softDelete(quizToDelete.id);
        this.logger.log(`User ${userFromGuard.email} deleted quiz ${quizToDelete}`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": quizToDelete.id,
            },
            "result": "deleted"
        };
    }

    async findAll(paginationsQuizDto: PaginationsQuizDto): Promise<GeneralResponse<TQuiz>> {
        const {page, revert, companyId} = paginationsQuizDto;
        const order = revert === true ? 'ASC' : 'DESC';
        const allQuiz: Quiz[] = await this.quizRepository.find({
            where: {company: {id: companyId}},
            take: +process.env.PAGE_PAGINATION,
            skip: (page - 1) * (+process.env.PAGE_PAGINATION),
            order: {
                id: order,
            },
        });
        const quizResponseCutedArr: TQuizForResponse[] = allQuiz.map((quiz: Quiz) => {
            return {
                id: quiz.id,
                description: quiz.description,
                frequencyInDay: quiz.frequencyInDay,
                questions: quiz.questions,
            };
        });
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": quizResponseCutedArr,
            },
            "result": "created"
        };
    }

    async findQuizById(quizId: number): Promise<Quiz | null> {
        return this.quizRepository.findOne({
            where: {id: quizId},
            relations: ['company'],
        });
    }
    async findQuizByIdQuestion(quizId: number): Promise<Quiz | null> {
        return this.quizRepository.findOne({
            where: {id: quizId},
            relations: ['questions'],
        });
    }
}
