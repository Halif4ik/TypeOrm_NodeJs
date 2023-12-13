import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Quiz} from "./entities/quizz.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TQuiz, TQuizForResponse} from "../GeneralResponse/interface/customResponces";
import {Answers} from "./entities/answers.entity";
import {Question} from "./entities/question.entity";
import {QuestionDto} from "./dto/question.dto";
import {AnswerDto} from "./dto/answer.dto";
import {Company} from "../company/entities/company.entity";
import {UpdateQuizDto} from "./dto/update-quizz.dto";
import {DeleteCompanyDto} from "../company/dto/delete-company.dto";


@Injectable()
export class QuizService {
    private readonly logger: Logger = new Logger(QuizService.name);

    constructor(@InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
                @InjectRepository(Answers) private answersRepository: Repository<Answers>,
                @InjectRepository(Question) private questionRepository: Repository<Question>) {
    }

    async createQuiz(userFromGuard: User, createQuizDto: CreateQuizDto): Promise<GeneralResponse<TQuiz>> {
        const currentCompany: Company = userFromGuard.company.find((company: Company) =>
            company.id === createQuizDto.companyId);
        if (!currentCompany)
            throw new HttpException("Incorrect company ID for this user", HttpStatus.NOT_FOUND);

        if (createQuizDto.questions.length < 2)
            throw new HttpException("You must add at least 2 questions", HttpStatus.BAD_REQUEST);
        createQuizDto.questions.some((question: QuestionDto) => {
            if (question.varsAnswers.length < 2)
                throw new HttpException("You must add at least 2 variants of answers", HttpStatus.BAD_REQUEST);
        });

        const newQuiz: Quiz = this.quizRepository.create({
            description: createQuizDto.description,
            frequencyInDay: createQuizDto.frequencyInDay,
            company: currentCompany,
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
                    varAnswer: oneVariantAnswer.varAnswer,
                    question: savedNewQuestion,/*todo*/
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
            relations: ['questions', 'questions.varsAnswers', 'company'],
        });
        console.log('this.quizRepository-', this.quizRepository);
        console.log('quizToUpdate-', quizToUpdate);
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

        const newQuestions = updateQuizDto.questions.map(async (question: QuestionDto) => {
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

    async deleteQuiz(userFromGuard: User, quizDeleteDTO: DeleteCompanyDto) {
        console.log('userFromGuard-', userFromGuard);
        console.log('id-', quizDeleteDTO.id);
        const quizToDelete: Quiz | undefined = await this.quizRepository.findOne({
            where: {id: quizDeleteDTO.id},
            relations: ['company'],
        });

        console.log('findAll', await this.quizRepository.find());

        console.log('quizToDelete-', quizToDelete);
        if (!quizToDelete) throw new HttpException("Quiz not found", HttpStatus.BAD_REQUEST);


        /*await this.quizRepository.softDelete(quizToDelete.id);*/
        this.logger.log(`User ${userFromGuard.email} deleted quiz ${quizToDelete}`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": {
                    id: quizToDelete.id,
                },
            },
            "result": "deleted"
        };
    }

    async findAll() {
        console.log('findAll', await this.quizRepository.findOne(
            {
                where: {id: 17},
                relations: ['company'],
            }
        ));
        return this.quizRepository.findOne(
            {
                where: {id: 17},
                relations: ['company'],
            }
        );
    }
}
