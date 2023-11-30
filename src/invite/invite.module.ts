import { Module} from '@nestjs/common';
import {InviteService} from './invite.service';
import {InviteController} from './invite.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Invite} from "./entities/invite.entity";
import {UserModule} from "../user/user.module";

@Module({
    controllers: [InviteController],
    providers: [InviteService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([Invite]),
        JwtModule, PassportModule],
    exports: [InviteService]
})
export class InviteModule {
}
