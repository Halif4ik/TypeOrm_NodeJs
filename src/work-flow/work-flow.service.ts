import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {
    TAnswers,
    TPassedQuiz,
    TPassedQuizForResponce, TQuestion,
    TRedisData
} from "../GeneralResponse/interface/customResponces";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QuizService} from "../quizz/quizService";
import {PassedQuiz} from "./entities/passedQuiz.entity";
import {Question} from "../quizz/entities/question.entity";
import {Answers} from "../quizz/entities/answers.entity";
import {AvgRating} from "./entities/averageRating.entity";
import {GeneralRating} from "./entities/avgRatingAll.entity";
import {RedisService} from "@songkeys/nestjs-redis";
import Redis from 'ioredis';
import * as process from "process";
import {Quiz} from "../quizz/entities/quizz.entity";


@Injectable()
export class WorkFlowService {
    private readonly logger: Logger = new Logger(WorkFlowService.name);

    constructor(private quizService: QuizService,
                @InjectRepository(PassedQuiz) private passedQuizRepository: Repository<PassedQuiz>,
                @InjectRepository(GeneralRating) private generalRatingRepository: Repository<GeneralRating>,
                @InjectRepository(AvgRating) private avgRatingRepository: Repository<AvgRating>,
                private readonly redisService: RedisService,
    ) {
    }

    async createAnswers(userFromGuard: User, createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<TAnswers>> {
        const startedQuizByUser: PassedQuiz = await this.passedQuizRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                targetQuiz: {id: createWorkFlowDto.quizId}
            },
            relations: ['targetQuiz.questions', 'targetQuiz.questions.varsAnswers', 'targetQuiz.company']
        });
        if (!startedQuizByUser || !startedQuizByUser.isStarted)
            throw new HttpException("Quiz not found or not started", HttpStatus.BAD_REQUEST);

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
        startedQuizByUser.isStarted = false;

        const redisResponce: string = await this.savePaasedQuizToRedis(startedQuizByUser, createWorkFlowDto);
        if (redisResponce === 'OK')
            this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} and save to redis with out error `);

        await this.passedQuizRepository.save(startedQuizByUser);

        const avgRateUser: AvgRating = await this.calculeteAvgRatingForUserByComp(rightAnswers,
            startedQuizByUser, userFromGuard);

        /*const temp = await this.getQuizFromRedis(`7`);*/
        this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} with
         ${rightAnswers.length} right answers`);
        this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} in company ${
            startedQuizByUser.targetQuiz.company.id}  with ${rightAnswers.length} right answers and got ${avgRateUser.averageRating} rating from 10`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "answers": rightAnswers,
            },
            "result": "finished"
        };
    }

    private async savePaasedQuizToRedis(startedQuizByUser: PassedQuiz, createWorkFlowDto: CreateWorkFlowDto): Promise<string> {
        const client: Redis = this.redisService.getClient();
        const redisKey: string = `startedQuiz:${startedQuizByUser.user.id}:${startedQuizByUser.targetQuiz.id}`;
        const dataForRedis: TRedisData = {
            user: {
                id: startedQuizByUser.user.id,
                email: startedQuizByUser.user.email,
                firstName: startedQuizByUser.user.firstName,
            },
            company: {
                id: startedQuizByUser.targetQuiz.company.id,
                name: startedQuizByUser.targetQuiz.company.name,
                description: startedQuizByUser.targetQuiz.company.description,
            },
            targetQuiz: {
                id: startedQuizByUser.targetQuiz.id,
                questions: startedQuizByUser.targetQuiz.questions.map((question: Question): TQuestion => ({
                    id: question.id,
                    questionText: question.questionText,
                }))
            },
            userAnswers: createWorkFlowDto.questions.map((questionAndVarAnswer): {
                id: number,
                userAnswer: string
            } => ({
                id: questionAndVarAnswer.id,
                userAnswer: questionAndVarAnswer.userAnswer,
            }))
        }
        const value: string = JSON.stringify(dataForRedis);

        return client.set(redisKey, value,
            'EX', +process.env.REDIS_TIME_EXPIRATION);
        ;
    }

    private async calculeteAvgRatingForUserByComp(rightAnswers: Answers[], startedQuizByUser: PassedQuiz,
                                                  userFromGuard: User): Promise<AvgRating> {
        const listUserAvgRating: AvgRating[] = await this.avgRatingRepository.find({
            where: {
                user: {id: userFromGuard.id},
            },
            relations: ['passedQuiz.targetQuiz.questions', 'passedQuiz.rightAnswers', 'passedCompany']
        });

        /*calculate average rating for user in this company*/
        let avgRateUser: AvgRating | undefined = listUserAvgRating.find((avgRating: AvgRating) =>
            avgRating.passedCompany.id === startedQuizByUser.targetQuiz.company.id);


        /*if user fill once quiz for this company*/
        if (!avgRateUser) {
            const calculateAvgRatingForUserByComp: number = rightAnswers.length /
                startedQuizByUser.targetQuiz.questions.length;
            avgRateUser = this.avgRatingRepository.create({
                user: userFromGuard,
                passedCompany: startedQuizByUser.targetQuiz.company,
                averageRating: calculateAvgRatingForUserByComp,
                passedQuiz: [startedQuizByUser]
            });
        } else {
            //user  already has rating fo current  company and we need to update it
            const oldRightAnswers: number[] = avgRateUser.passedQuiz.map((passedQuiz: PassedQuiz) =>
                passedQuiz.rightAnswers.length);
            const oldAllQuestions: number[] = avgRateUser.passedQuiz.map((passedQuiz: PassedQuiz) =>
                passedQuiz.targetQuiz.questions.length);
            const oldAllRightAnswersCount: number = oldRightAnswers.reduce((a, b) => a + b, 0);
            const oldAllQuestionsCount: number = oldAllQuestions.reduce((a, b) => a + b, 0);
            const newAllRightAnswersCount: number = oldAllRightAnswersCount + rightAnswers.length;
            const newAllQuestionsCount: number = oldAllQuestionsCount + startedQuizByUser.targetQuiz.questions.length;
            const newAverageRating: number = newAllRightAnswersCount / newAllQuestionsCount;

            /*fixing bug apdating relation many-to many when i used update*/
            avgRateUser.passedQuiz.push(startedQuizByUser);
            avgRateUser.averageRating = newAverageRating;
            avgRateUser.updateAt = new Date();
        }

        /*re-calculating rating in user in all passed company */
        let generalRating: GeneralRating = await this.generalRatingRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
            },
        });
        if (!generalRating) {
            generalRating = this.generalRatingRepository.create({
                user: userFromGuard,
                ratingInSystem: avgRateUser.averageRating
            });
        } else {
            const summUserOldRatings: number = listUserAvgRating.reduce((sum: number, avgRating: AvgRating) => {
                return sum + avgRating.averageRating;
            }, 0);
            generalRating.ratingInSystem = (summUserOldRatings + avgRateUser.averageRating) / (listUserAvgRating.length + 1);
        }

        await this.avgRatingRepository.save(avgRateUser);
        await this.generalRatingRepository.save(generalRating);
        return avgRateUser;
    }

    async start(userFromGuard: User, quizId: number): Promise<GeneralResponse<TPassedQuiz>> {
        const quizForStartFlow: Quiz = await this.quizService.findQuizByIdQuestion(quizId);
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
                rightAnswers: [],
                isStarted: true
            });
            const savedStartedQuizByUser: PassedQuiz = await this.passedQuizRepository.save(newStartedQuiz);
            savedStartedQuizCuted = {
                ...savedStartedQuizByUser,
                user: {
                    id: savedStartedQuizByUser.user.id,
                    email: savedStartedQuizByUser.user.email,
                    firstName: savedStartedQuizByUser.user.firstName,
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
                isStarted: true
            });
            this.logger.log(`User ${userFromGuard.email} started do quiz ${quizForStartFlow.id} again`);
            /*made object for response*/
            savedStartedQuizCuted = {
                user: {
                    id: startedQuizByUser.user.id,
                    email: startedQuizByUser.user.email,
                    firstName: startedQuizByUser.user.firstName,
                },
                targetQuiz: startedQuizByUser.targetQuiz,
                id: startedQuizByUser.id,
                createDate: startedQuizByUser.updateAt,
                updateAt: new Date(),
                isStarted: startedQuizByUser.isStarted,
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

    private async getQuizFromRedis(redisKey: string): Promise<PassedQuiz | null> {
        const client: Redis = this.redisService.getClient();
        const cachedData: string | null = await client.get(redisKey);
        if (cachedData)
            return JSON.parse(cachedData);
        return null;
    }
}
