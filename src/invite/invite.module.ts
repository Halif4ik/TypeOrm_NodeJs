import { Module} from '@nestjs/common';
import {InviteService} from './invite.service';
import {InviteController} from './invite.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Invite} from "./entities/invite.entity";

@Module({
    controllers: [InviteController],
    providers: [InviteService],
    imports: [
        TypeOrmModule.forFeature([Invite]),
        JwtModule, PassportModule],
    exports: [InviteService]
})
export class InviteModule {
}
