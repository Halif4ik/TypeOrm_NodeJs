import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/pass-user";
import {User} from "../user/entities/user.entity";

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/create')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createInvite(@UserDec() userFromGuard: User,@Body() createInviteDto: CreateInviteDto) {
    return this.inviteService.create(userFromGuard,createInviteDto);
  }

  @Get()
  findAll() {
    return this.inviteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inviteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInviteDto: UpdateInviteDto) {
    return this.inviteService.update(+id, updateInviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inviteService.remove(+id);
  }
}
