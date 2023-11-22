import {Module} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CompanyController} from './company.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "./entities/company.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {Invite} from "../invite/entities/invite.entity";
import {User} from "../user/entities/user.entity";

@Module({
    controllers: [CompanyController],
    providers: [CompanyService],
    imports: [  UserModule,
         TypeOrmModule.forFeature([Company,Invite,User]),
        JwtModule, PassportModule],
    exports: [CompanyService]
})
export class CompanyModule {
}
