import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  createInvite(@Body() createInviteDto: CreateInviteDto) {
    return this.inviteService.create(createInviteDto);
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
