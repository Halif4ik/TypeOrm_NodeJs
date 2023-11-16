import {GenRespController} from "./GeneralResponse/gen-resp.controller";
import {Module} from "@nestjs/common";
import {GenRespService} from "./GeneralResponse/gen-resp.service";
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { InviteModule } from './invite/invite.module';

@Module({
    controllers: [GenRespController],
    providers: [GenRespService],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_DOCKER_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_ROOT_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            //entities: [User,Auth],
            synchronize: false,//only for course
            autoLoadEntities: true,
        }),
        UserModule,
        AuthModule,
        CompanyModule,
        InviteModule,
    ],
})
export class AppModule {
}