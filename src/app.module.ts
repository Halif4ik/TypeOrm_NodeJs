import {GenRespController} from "./GeneralResponse/gen-resp.controller";
import {Module} from "@nestjs/common";
import { RedisModule } from 'nestjs-redis';
import {GenRespService} from "./GeneralResponse/gen-resp.service";
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { InviteModule } from './invite/invite.module';
import { RequestsModule } from './reqests/requestsModule';
import { RolesModule } from './roles/roles.module';
import { QuizzModule } from './quizz/quizz.module';
import { WorkFlowModule } from './work-flow/work-flow.module';
import { AnaliticModule } from './analitic/analitic.module';

@Module({
    controllers: [GenRespController],
    providers: [GenRespService],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            isGlobal: true,
        }),
      /*  RedisModule.register({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        }),*/
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_DOCKER_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_ROOT_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            synchronize: false,// true only for course with out migration
            autoLoadEntities: true,
            // ssl: { rejectUnauthorized: false },for  connect to render
        }),
        UserModule,
        AuthModule,
        CompanyModule,
        InviteModule,
        RequestsModule,
        RolesModule,
        QuizzModule,
        WorkFlowModule,
        AnaliticModule,
    ],
})
export class AppModule {
}