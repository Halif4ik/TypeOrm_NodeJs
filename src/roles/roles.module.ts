import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import {UserModule} from "../user/user.module";
import {CompanyModule} from "../company/company.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "./entities/role.entity";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
      UserModule,
      CompanyModule,
      TypeOrmModule.forFeature([Role]),
      JwtModule, PassportModule
  ]
})
export class RolesModule {}
