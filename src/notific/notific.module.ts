import {Module} from '@nestjs/common';
import {NotificService} from './notific.service';
import {NotificController} from './notific.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Notific} from "./entities/notific.entity";
import {Company} from "../company/entities/company.entity";
import {User} from "../user/entities/user.entity";
import {Quiz} from "../quizz/entities/quizz.entity";
import {PassedQuiz} from "../work-flow/entities/passedQuiz.entity";

@Module({
  controllers: [NotificController],
  providers: [NotificService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notific,Company,User,Quiz,PassedQuiz]),
    JwtModule,
    PassportModule,
  ],
  exports: [NotificService]
})
export class NotificModule {}
