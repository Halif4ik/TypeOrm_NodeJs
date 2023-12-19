import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TPassedQuizForResponce, TQuiz, TQuizForResponse} from "../GeneralResponse/interface/customResponces";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QuizService} from "../quizz/quizService";
import {PassedQuiz} from "./entities/passedQuiz.entity";

@Injectable()
export class WorkFlowService {
    private readonly logger: Logger = new Logger(WorkFlowService.name);

    constructor(private quizService: QuizService,
                @InjectRepository(PassedQuiz) private passedQuizRepository: Repository<PassedQuiz>,) {
    }

    async create(userFromGuard: User, createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<any>> {


        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": {},
            },
            "result": "created"
        };
    }


    async start(userFromGuard: User, quizId: number): Promise<GeneralResponse<any>> {
        const quizForStartFlow: TQuizForResponse = await this.quizService.findQuizByIdQuestion(quizId);
        if (!quizForStartFlow)
            throw new HttpException("Quiz not found", HttpStatus.NOT_FOUND);
        const startedQuizByUser: PassedQuiz = await this.passedQuizRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                targetQuiz: {id: quizForStartFlow.id}
            }
        });
        let savedStartedQuizCuted;
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
            }
        } else {
            const frequencyInMillisec: number = 86400000 * quizForStartFlow.frequencyInDay;
            //check expiration time for this user to this quiz
            const howMuchTimeLeft: number = new Date(startedQuizByUser.updateAt).getTime() - new Date(startedQuizByUser.createDate).getTime();
            console.log('Diff-', howMuchTimeLeft);
            console.log('frequencyInMillisec-', frequencyInMillisec);
            if (howMuchTimeLeft < frequencyInMillisec)
                throw new HttpException("Expiration time for this User to this quiz", HttpStatus.BAD_REQUEST);

            await this.passedQuizRepository.update({id: startedQuizByUser.id}, {
                createDate: startedQuizByUser.updateAt,
                updateAt: new Date(),
            });
            savedStartedQuizCuted = {
                createDate: startedQuizByUser.updateAt,
                updateAt: new Date(),
            };

        }


        this.logger.log(`User ${userFromGuard.email} started do quiz ${quizForStartFlow}`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "quiz": savedStartedQuizCuted,
            },
            "result": "created"
        };
        ;
    }
}
