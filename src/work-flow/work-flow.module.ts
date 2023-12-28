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
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    controllers: [WorkFlowController],
    providers: [WorkFlowService],
    imports: [
        QuizzModule,
        ConfigModule,
        TypeOrmModule.forFeature([PassedQuiz, AvgRating, GeneralRating]),
        RedisModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                readyLog: true,
                config: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                    password: configService.get<string>('REDIS_PASSWORD'),
                },
            }),
            inject: [ConfigService],
        }),
        JwtModule,
        PassportModule,
    ],
})
export class WorkFlowModule {
}
