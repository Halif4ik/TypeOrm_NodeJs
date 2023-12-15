import {Module} from '@nestjs/common';
import {WorkFlowService} from './work-flow.service';
import {WorkFlowController} from './work-flow.controller';
import {UserModule} from "../user/user.module";
import {CompanyModule} from "../company/company.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quiz} from "../quizz/entities/quizz.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {WorkFlow} from "./entities/work-flow.entity";

@Module({
    controllers: [WorkFlowController],
    providers: [WorkFlowService],
    imports: [
        UserModule,
        CompanyModule,
        Quiz,
        TypeOrmModule.forFeature([WorkFlow]),
        JwtModule, PassportModule
    ]
})
export class WorkFlowModule {
}
