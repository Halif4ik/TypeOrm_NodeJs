import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Quiz} from "./entities/quizz.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IQuiz} from "../GeneralResponse/interface/customResponces";
import {Answers} from "./entities/answers.entity";
import {Question} from "./entities/question.entity";
import {QuestionDto} from "./dto/question.dto";
import {AnswerDto} from "./dto/answer.dto";

@Injectable()
export class QuizService {
    private readonly logger: Logger = new Logger(QuizService.name);

    constructor(@InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
                @InjectRepository(Answers) private answersRepository: Repository<Answers>,
                @InjectRepository(Question) private questionRepository: Repository<Question>) {
    }

    async createQuiz(userFromGuard: User, createQuizDto: CreateQuizDto): Promise<GeneralResponse<any>> {
        for (const question of createQuizDto.questions) {
            const newQuestion: Question = this.questionRepository.create({
                questionText: question.questionText,
                rightAnswer: question.rightAnswer,
                varsAnswers: []
            });
            const result = await this.questionRepository.save(newQuestion);
            console.log('result-', result);
        }
/*todo*/
        createQuizDto.questions.forEach(async (question: QuestionDto) => {
            for (const oneVariantAnswer of question.varsAnswers) {
                const newVar: Answers = this.answersRepository.create({
                    varAnswer: oneVariantAnswer.varAnswer,
                    question: question,
                });
                console.log('newVar+', newVar);
                await this.answersRepository.save(newVar);
            }
        });


        this.logger.log(`User ${userFromGuard.email} created quiz ${createQuizDto}`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": 'newQuiz',
            },
            "result": "created"
        };
        ;
    }
}
