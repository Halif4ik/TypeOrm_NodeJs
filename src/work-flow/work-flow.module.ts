import {Module} from '@nestjs/common';
import {WorkFlowService} from './work-flow.service';
import {WorkFlowController} from './work-flow.controller';
import {UserModule} from "../user/user.module";
import {CompanyModule} from "../company/company.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quiz} from "../quizz/entities/quizz.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {PassedQuiz} from "./entities/passedQuiz.entity";
import {QuizService} from "../quizz/quizService";
import {QuizzModule} from "../quizz/quizz.module";
import {AvgRating} from "./entities/averageRating.entity";
import {GeneralRating} from "./entities/avgRatingAll.entity";

@Module({
    controllers: [WorkFlowController],
    providers: [WorkFlowService],
    imports: [
        QuizzModule,
        TypeOrmModule.forFeature([PassedQuiz,AvgRating,GeneralRating]),
        JwtModule, PassportModule
    ]
})
export class WorkFlowModule {
}