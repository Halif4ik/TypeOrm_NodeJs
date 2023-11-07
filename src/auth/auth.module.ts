import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Auth} from "./entities/auth.entity";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {Auth0Strategy} from "./auth0.strategy";
import {JwtStrategyAuth} from "./jwt.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService,LocalStrategy,Auth0Strategy,JwtStrategyAuth],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([Auth]),
        JwtModule,PassportModule]
})
export class AuthModule {
}
