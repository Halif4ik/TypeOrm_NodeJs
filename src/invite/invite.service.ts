import { Injectable } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@Injectable()
export class InviteService {
  create(createInviteDto: CreateInviteDto) {
    return 'This action adds a new invite';
  }

  findAll() {
    return `This action returns all invite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invite`;
  }

  update(id: number, updateInviteDto: UpdateInviteDto) {
    return `This action updates a #${id} invite`;
  }

  remove(id: number) {
    return `This action removes a #${id} invite`;
  }
}
