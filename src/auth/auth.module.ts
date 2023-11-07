import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Auth} from "./entities/auth.entity";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService,LocalStrategy],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([Auth]),
        JwtModule,PassportModule]
})
export class AuthModule {
}
