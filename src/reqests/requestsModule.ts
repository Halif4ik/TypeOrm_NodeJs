import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ReqestsController } from './reqests.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {CompanyModule} from "../company/company.module";
import {Request} from "./entities/reqest.entity";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [ReqestsController],
  providers: [RequestsService],
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Request]),
    JwtModule, PassportModule],
})
export class RequestsModule {}
