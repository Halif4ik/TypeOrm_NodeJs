import {Module} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CompanyController} from './company.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "./entities/company.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Auth0Strategy} from "../auth/auth0.strategy";
import {JwtStrategyAuth} from "../auth/jwt.strategy";
import {UserModule} from "../user/user.module";

@Module({
    controllers: [CompanyController],
    providers: [CompanyService],
    imports: [  UserModule,
        TypeOrmModule.forFeature([Company]),
        JwtModule, PassportModule],
})
export class CompanyModule {
}
