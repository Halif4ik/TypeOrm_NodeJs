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


@Injectable()
export class QuizService {
    private readonly logger: Logger = new Logger(QuizService.name);

    constructor(@InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
                @InjectRepository(Answers) private answersRepository: Repository<Answers>,
                @InjectRepository(Question) private questionRepository: Repository<Question>) {
    }

    async createQuiz(userFromGuard: User, createQuizDto: CreateQuizDto): Promise<GeneralResponse<TQuiz>> {
        const currentCompany: Company = userFromGuard.company.find((company: any) =>
            company.id === createQuizDto.companyId);
        if (!currentCompany)
            throw new HttpException("Incorrect company ID for this user", HttpStatus.NOT_FOUND);

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
                    question: savedNewQuestion,
                });
                return this.answersRepository.save(newVar);
            });
            const savedAnswers: Answers[] = await Promise.all(arrPromisesAnswers);
            /*adding relation in Question arr all answers*/
            savedNewQuestion.varsAnswers = savedAnswers;
            await this.questionRepository.save(savedNewQuestion);
        }

        this.logger.log(`User ${userFromGuard.email} created quiz ${createQuizDto}`);
        const quizResponseCuted:TQuizForResponse = {
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

    async updateQuiz(userFromGuard: User, updateQuizDto: UpdateQuizDto) {

        const quizResponseCuted = {
            description: "savedQuiz.description",
            frequencyInDay: "savedQuiz.frequencyInDay",
            id: "savedQuiz.id",
        }
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": quizResponseCuted,
            },
            "result": "created"
        };
    }
}
