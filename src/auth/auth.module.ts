import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Auth} from "./entities/auth.entity";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [UserModule,
        TypeOrmModule.forFeature([Auth]),
        JwtModule.register({
        secret: process.env.SECRET || "SECRET",
        signOptions: {
            expiresIn: "24h"
        },
    })]
})
export class AuthModule {
}
