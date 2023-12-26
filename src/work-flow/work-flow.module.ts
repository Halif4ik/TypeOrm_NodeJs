import {Module} from '@nestjs/common';
import {WorkFlowService} from './work-flow.service';
import {WorkFlowController} from './work-flow.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {PassedQuiz} from './entities/passedQuiz.entity';
import {QuizzModule} from '../quizz/quizz.module';
import {AvgRating} from './entities/averageRating.entity';
import {GeneralRating} from './entities/avgRatingAll.entity';
import {RedisModule} from '@songkeys/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    controllers: [WorkFlowController],
    providers: [WorkFlowService],
    imports: [
        QuizzModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([PassedQuiz, AvgRating, GeneralRating]),
        RedisModule.forRoot({
                readyLog: true,
                config: {
                    host: new ConfigService().get<string>('REDIS_HOST'),
                    port: new ConfigService().get<number>('REDIS_PORT') ,
                    password: new ConfigService().get<string>('REDIS_PASSWORD') ,
                }
            },
            false
        ),
        JwtModule,
        PassportModule,
    ],
})
export class WorkFlowModule {
}
