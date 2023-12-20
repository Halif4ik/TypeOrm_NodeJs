import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {
    TAnswers,
    TPassedQuiz,
    TPassedQuizForResponce,
    TQuizForResponse
} from "../GeneralResponse/interface/customResponces";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QuizService} from "../quizz/quizService";
import {PassedQuiz} from "./entities/passedQuiz.entity";
import {Question} from "../quizz/entities/question.entity";
import {Answers} from "../quizz/entities/answers.entity";
import {AvgRating} from "./entities/averageRating.entity";

@Injectable()
export class WorkFlowService {
    private readonly logger: Logger = new Logger(WorkFlowService.name);

    constructor(private quizService: QuizService,
                @InjectRepository(PassedQuiz) private passedQuizRepository: Repository<PassedQuiz>,
                @InjectRepository(AvgRating) private avgRatingRepository: Repository<AvgRating>,) {
    }

    async createAnswers(userFromGuard: User, createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<TAnswers>> {
        const startedQuizByUser: PassedQuiz = await this.passedQuizRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                targetQuiz: {id: createWorkFlowDto.quizId}
            },
            relations: ['targetQuiz.questions', 'targetQuiz.questions.varsAnswers', 'targetQuiz.company']
        });
        if (!startedQuizByUser)
            throw new HttpException("Quiz not found", HttpStatus.NOT_FOUND);
        const questionsWithRightAnswer: Question[] = startedQuizByUser.targetQuiz.questions.filter((questionFromBd: Question) => {
            return createWorkFlowDto.questions.find(questUserResponse => {
                if (questionFromBd.id === questUserResponse.id) {
                    questionFromBd.rightAnswer = questionFromBd.rightAnswer.toLowerCase().trim();
                    questUserResponse.userAnswer = questUserResponse.userAnswer.toLowerCase().trim();
                    return questionFromBd.rightAnswer === questUserResponse.userAnswer;
                }
            });
        });
        const rightAnswers: Answers[] = questionsWithRightAnswer.map((oneQuestion: Question) => {
            return oneQuestion.varsAnswers.find((answer: Answers) =>
                answer.varAnswer.toLowerCase().trim() === oneQuestion.rightAnswer.toLowerCase().trim()
            );
        });

        startedQuizByUser.updateAt = new Date();
        startedQuizByUser.rightAnswers = rightAnswers;
        await this.passedQuizRepository.save(startedQuizByUser);

        this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} with ${questionsWithRightAnswer.length} right answers`);

        /*calculate average rating for user */
        const avgRateForUserCurrentComp: AvgRating = await this.avgRatingRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                passedCompany: {id: startedQuizByUser.targetQuiz.company.id}
            },
        });

        const calculateAvgRatingForUserByComp: number = questionsWithRightAnswer.length / startedQuizByUser.targetQuiz.questions.length * 10;
        console.log('CALC-', calculateAvgRatingForUserByComp);
        if (!avgRateForUserCurrentComp) {
            const newAvgRateForUserByComp: AvgRating = this.avgRatingRepository.create({
                user: userFromGuard,
                passedCompany: startedQuizByUser.targetQuiz.company,
                averageRating: calculateAvgRatingForUserByComp,
                ratingInsideCompany: calculateAvgRatingForUserByComp,
            });
            await this.avgRatingRepository.save(newAvgRateForUserByComp);
            this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} with ${questionsWithRightAnswer.length} right answers and got ${calculateAvgRatingForUserByComp} rating from 10`);
        }else {
            await this.avgRatingRepository.update({id: avgRateForUserCurrentComp.id}, {
                averageRating: calculateAvgRatingForUserByComp,
                ratingInsideCompany: calculateAvgRatingForUserByComp,
                updateAt: new Date(),
            });
            this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} with ${questionsWithRightAnswer.length} right answers and got ${calculateAvgRatingForUserByComp} rating from 10`);
        }

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "answers": rightAnswers,
            },
            "result": "finished"
        };
    }

    async start(userFromGuard: User, quizId: number): Promise<GeneralResponse<TPassedQuiz>> {
        const quizForStartFlow: TQuizForResponse = await this.quizService.findQuizByIdQuestion(quizId);
        if (!quizForStartFlow)
            throw new HttpException("Quiz not found", HttpStatus.NOT_FOUND);
        const startedQuizByUser: PassedQuiz = await this.passedQuizRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                targetQuiz: {id: quizForStartFlow.id}
            },
            relations: ['targetQuiz.questions']
        });
        let savedStartedQuizCuted: TPassedQuizForResponce;
        if (!startedQuizByUser) {
            const newStartedQuiz: PassedQuiz = this.passedQuizRepository.create({
                user: userFromGuard,
                targetQuiz: quizForStartFlow,
                rightAnswers: []
            });
            const savedStartedQuizByUser: PassedQuiz = await this.passedQuizRepository.save(newStartedQuiz);
            savedStartedQuizCuted = {
                ...savedStartedQuizByUser,
                user: {
                    id: savedStartedQuizByUser.user.id,
                    email: savedStartedQuizByUser.user.email,
                    firstName: savedStartedQuizByUser.user.firstName,
                    isActive: null
                },
                targetQuiz: {
                    ...savedStartedQuizByUser.targetQuiz,
                    questions: savedStartedQuizByUser.targetQuiz.questions.map((question: Question) => ({
                        ...question,
                        rightAnswer: null
                    }))
                },
            }
            this.logger.log(`User ${userFromGuard.email} started do quiz ${quizForStartFlow.id}`);
        } else {
            const frequencyInMillisec: number = 86400000 * quizForStartFlow.frequencyInDay;
            //check expiration time for this user to this quiz
            const howMuchTimeLeft: number = new Date(startedQuizByUser.updateAt).getTime() - new Date(startedQuizByUser.createDate).getTime();
            if (howMuchTimeLeft < frequencyInMillisec)
                throw new HttpException("Expiration time for this User to this quiz", HttpStatus.BAD_REQUEST);

            await this.passedQuizRepository.update({id: startedQuizByUser.id}, {
                createDate: startedQuizByUser.updateAt,
                updateAt: new Date(),
            });
            this.logger.log(`User ${userFromGuard.email} started do quiz ${quizForStartFlow.id} again`);
            /*made object for response*/
            savedStartedQuizCuted = {
                user: {
                    id: startedQuizByUser.user.id,
                    email: startedQuizByUser.user.email,
                    firstName: startedQuizByUser.user.firstName,
                    isActive: null
                },
                targetQuiz: startedQuizByUser.targetQuiz,
                id: startedQuizByUser.id,
                createDate: startedQuizByUser.updateAt,
                updateAt: new Date(),
            };

        }
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": savedStartedQuizCuted,
            },
            "result": "created"
        };
    }
}
