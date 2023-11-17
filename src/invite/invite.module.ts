import {forwardRef, Module} from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Invite} from "./entities/invite.entity";
import { User } from "../user/entities/user.entity";
import { Company } from "../company/entities/company.entity";
@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [
    TypeOrmModule.forFeature([Invite, User, Company]),
    JwtModule, PassportModule],
})
export class InviteModule {}
