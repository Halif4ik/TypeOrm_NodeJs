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
        this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} with
         ${rightAnswers.length} right answers`);

        this.calculeteAvgRatingForUserByComp(rightAnswers, startedQuizByUser, userFromGuard, createWorkFlowDto);

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "answers": rightAnswers,
            },
            "result": "finished"
        };
    }

    private async calculeteAvgRatingForUserByComp(rightAnswers: Answers[], startedQuizByUser: PassedQuiz, userFromGuard: User, createWorkFlowDto: CreateWorkFlowDto):Promise<void> {
        /*calculate average rating for user in this company*/
        const avgRateUsers: AvgRating = await this.avgRatingRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                passedCompany: {id: startedQuizByUser.targetQuiz.company.id}
            },
            relations: ['passedQuiz.targetQuiz.questions', 'passedQuiz.rightAnswers']
        });

        if (!avgRateUsers) {/*if user fill once quiz for this company*/
            console.log('rightAnswers-', rightAnswers.length);
            console.log('allquestions-', startedQuizByUser.targetQuiz.questions.length);
            const calculateAvgRatingForUserByComp: number = rightAnswers.length /
                startedQuizByUser.targetQuiz.questions.length * 10;
            const newAvgRateForUserByComp: AvgRating = this.avgRatingRepository.create({
                user: userFromGuard,
                passedCompany: startedQuizByUser.targetQuiz.company,
                averageRating: calculateAvgRatingForUserByComp,
                ratingInsideCompany: calculateAvgRatingForUserByComp,
                passedQuiz: [startedQuizByUser]
            });

            await this.avgRatingRepository.save(newAvgRateForUserByComp);
            this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} in company ${
                startedQuizByUser.targetQuiz.company.id}  with ${rightAnswers.length} right answers and got ${calculateAvgRatingForUserByComp} rating from 10`);
        } else {//user  already has rating fo current  company and we need to update it
            const oldRightAnswers: number[] = avgRateUsers.passedQuiz.map((passedQuiz: PassedQuiz) =>
                passedQuiz.rightAnswers.length);
            console.log('oldRightAnswers-', oldRightAnswers);
            const oldAllQuestions: number[] = avgRateUsers.passedQuiz.map((passedQuiz: PassedQuiz) =>
                passedQuiz.targetQuiz.questions.length);
            console.log('oldAllQuestions-', oldAllQuestions);
            const oldAllRightAnswersCount: number = oldRightAnswers.reduce((a, b) => a + b, 0);
            console.log('oldAllRightAnswersCount-', oldAllRightAnswersCount);
            const oldAllQuestionsCount: number = oldAllQuestions.reduce((a, b) => a + b, 0);
            console.log('oldAllQuestionsCount-', oldAllQuestionsCount);
            const newAllRightAnswersCount: number = oldAllRightAnswersCount + rightAnswers.length;
            const newAllQuestionsCount: number = oldAllQuestionsCount + startedQuizByUser.targetQuiz.questions.length;
            const newAverageRating: number = newAllRightAnswersCount / newAllQuestionsCount * 10;

            console.log('newAllRightAnswersCount-', newAllRightAnswersCount);
            console.log('newAllQuestionsCount-', newAllQuestionsCount);
            console.log('newAverageRating-', newAverageRating);

            await this.avgRatingRepository.update({id: avgRateUsers.id}, {
                averageRating: newAverageRating,
                ratingInsideCompany: newAverageRating,
                updateAt: new Date(),
            });
            this.logger.log(`User ${userFromGuard.email} finished do quiz ${createWorkFlowDto.quizId} in company ${
                startedQuizByUser.targetQuiz.company.id}  with ${rightAnswers.length} right answers and got ${newAverageRating} rating from 10`);
        }
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
