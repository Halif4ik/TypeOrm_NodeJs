import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateOrDelInviteDto } from './dto/create-or-del-invite.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, TInvite, IRequests} from "../GeneralResponse/interface/customResponces";
import {AcceptInviteDto} from "./dto/update-invite.dto";

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/create')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createInvite(@UserDec() userFromGuard: User,@Body() createInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<TInvite>> {
    return this.inviteService.create(userFromGuard,createInviteDto);
  }

  @Delete('/deleteInvite')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  deleteInvite(@UserDec() userFromGuard: User,@Body() createInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<IDeleted>> {
    return this.inviteService.deleteInvite(userFromGuard,createInviteDto);
  }

  @Patch('/accept')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  acceptInvite(@UserDec() userFromGuard: User,@Body() acceptInviteDto: AcceptInviteDto) {
    return this.inviteService.updateInvite(userFromGuard,acceptInviteDto);
  }

  // 11. List owner's invite to companies
  // Endpoint: GET /invite/my
  // Permissions: Authenticated owner
  @Get('/my')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  listMyRequests(@UserDec() userFromGuard: User,):Promise<GeneralResponse<TInvite>>{
    return this.inviteService.listUserInvites(userFromGuard);
  }
}
