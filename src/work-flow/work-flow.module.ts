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
import {ConfigService} from "@nestjs/config";

const configService = new ConfigService();
import * as process from "process";

@Module({
    controllers: [WorkFlowController],
    providers: [WorkFlowService],
    imports: [
        QuizzModule,
        TypeOrmModule.forFeature([PassedQuiz, AvgRating, GeneralRating]),
        RedisModule.forRoot({
                readyLog: true,
                config: {
                    host: 'redis-17773.c55.eu-central-1-1.ec2.cloud.redislabs.com',
                    port: configService.get<number>('REDIS_PORT') || 17773,
                    password: configService.get<string>('REDIS_PASSWORD') || process.env.REDIS_PASSWORD || 'SiS0iQ7T7ZnKZyoIXjOvF9LRF95Vkj8I'
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
