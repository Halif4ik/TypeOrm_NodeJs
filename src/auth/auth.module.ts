import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [UserModule, JwtModule.register({
        secret: process.env.SECRET || "SECRET",
        signOptions: {
            expiresIn: "24h"
        },
    })]
})
export class AuthModule {
}
