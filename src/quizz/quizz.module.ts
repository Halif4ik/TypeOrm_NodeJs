import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import {UserModule} from "../user/user.module";
import {CompanyModule} from "../company/company.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Quizz} from "./entities/quizz.entity";
import {Question} from "./entities/question.entity";
import {Answers} from "./entities/answers.entity";

@Module({
  controllers: [QuizzController],
  providers: [QuizzService],
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Quizz,Question,Answers]),
    JwtModule, PassportModule
  ]
})
export class QuizzModule {}
