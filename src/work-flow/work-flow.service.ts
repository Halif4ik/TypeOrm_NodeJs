import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {UpdateWorkFlowDto} from './dto/update-work-flow.dto';
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TPassedQuizForResponce, TQuiz, TQuizForResponse} from "../GeneralResponse/interface/customResponces";
import {InjectRepository} from "@nestjs/typeorm";
import {Quiz} from "../quizz/entities/quizz.entity";
import {Repository} from "typeorm";
import {Answers} from "../quizz/entities/answers.entity";
import {Question} from "../quizz/entities/question.entity";
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
        const quizForStart: TQuizForResponse = await this.quizService.findQuizByIdQuestion(quizId);
        if (!quizForStart)
            throw new HttpException("Quiz not found", HttpStatus.NOT_FOUND);
        const userHasThisQuiz: PassedQuiz = await this.passedQuizRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
                targetQuiz: {id: quizForStart.id}
            }
        });
        let newStartedQuiz: PassedQuiz;
        if (!userHasThisQuiz) {
             newStartedQuiz = this.passedQuizRepository.create({
                user: userFromGuard,
                targetQuiz: quizForStart,
                rightAnswers: []
            });
        } else {
            console.log('Diff-', new Date(userHasThisQuiz.updateAt).getTime() - new Date(userHasThisQuiz.createDate).getTime());
            const frequencyInMilisec: number = 86400000 * quizForStart.frequencyInDay;
            //check expiration time
            if (new Date(userHasThisQuiz.updateAt).getTime() - new Date(userHasThisQuiz.createDate).getTime()
                < frequencyInMilisec)
                throw new HttpException("Expiration time for this User to this quiz", HttpStatus.BAD_REQUEST);
            /*todo*/
           /* userHasThisQuiz.$set('updateAt', []);*/
             newStartedQuiz = this.passedQuizRepository.create({
                user: userFromGuard,
                targetQuiz: quizForStart,
                rightAnswers: []
            });

        }


        console.log('newStartedQuiz-', newStartedQuiz);
        const savedStartedQuiz: PassedQuiz = await this.passedQuizRepository.save(newStartedQuiz);
        const savedStartedQuizCuted: TPassedQuizForResponce = {
            ...savedStartedQuiz,
            user: {
                id: savedStartedQuiz.user.id,
                email: savedStartedQuiz.user.email,
                firstName: savedStartedQuiz.user.firstName,
                isActive: null
            },
        }
        this.logger.log(`User ${userFromGuard.email} started do quiz ${quizForStart}`);
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
