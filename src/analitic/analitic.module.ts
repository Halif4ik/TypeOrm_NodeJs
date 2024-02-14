import {Module} from '@nestjs/common';
import {AnaliticService} from './analitic.service';
import {AnaliticController} from './analitic.controller';
import {QuizzModule} from "../quizz/quizz.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PassedQuiz} from "../work-flow/entities/passedQuiz.entity";
import {AvgRating} from "../work-flow/entities/averageRating.entity";
import {GeneralRating} from "../work-flow/entities/generalRating.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";

@Module({
   controllers: [AnaliticController],
   providers: [AnaliticService],
   imports: [
      QuizzModule,
      TypeOrmModule.forFeature([PassedQuiz, AvgRating, GeneralRating]),
      JwtModule,
      PassportModule,
      UserModule,
   ]
})
export class AnaliticModule {
}
