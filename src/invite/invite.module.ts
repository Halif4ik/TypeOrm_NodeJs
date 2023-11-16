import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import {UserModule} from "../user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Invite} from "./entities/invite.entity";
import {CompanyModule} from "../company/company.module";
import {Company} from "../company/entities/company.entity";
import {User} from "../user/entities/user.entity";

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [ UserModule,
      CompanyModule,
    TypeOrmModule.forFeature([Invite,Company,User]),
    JwtModule, PassportModule],
})
export class InviteModule {}
