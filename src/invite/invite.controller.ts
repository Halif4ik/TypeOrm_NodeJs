import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateOrDelInviteDto } from './dto/create-or-del-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IInvite} from "../GeneralResponse/interface/customResponces";

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/create')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createInvite(@UserDec() userFromGuard: User,@Body() createInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<IInvite>> {
    return this.inviteService.create(userFromGuard,createInviteDto);
  }

  @Delete('/deleteInvite')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  deleteInvite(@UserDec() userFromGuard: User,@Body() createInviteDto: CreateOrDelInviteDto) {
    return this.inviteService.deleteInvite(userFromGuard,createInviteDto);
  }

}
