import {TestikController} from "./GeneralResponse/testik.controller";
import {Module} from "@nestjs/common";
import {TestikService} from "./GeneralResponse/testik.service";
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';

@Module({
    controllers: [TestikController],
    providers: [TestikService],
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
    ],
})
export class AppModule {
}