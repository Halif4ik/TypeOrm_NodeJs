import {Module} from '@nestjs/common';
import {QuizService} from './quizService';
import {QuizzController} from './quizz.controller';
import {UserModule} from "../user/user.module";
import {CompanyModule} from "../company/company.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Quiz} from "./entities/quizz.entity";
import {Question} from "./entities/question.entity";
import {Answers} from "./entities/answers.entity";
import {NotificModule} from "../notific/notific.module";

@Module({
  controllers: [QuizzController],
  providers: [QuizService],
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Quiz,Question,Answers]),
    JwtModule, PassportModule,
      NotificModule
  ],
  exports: [QuizService]
})
export class QuizzModule {}
