import { Injectable } from '@nestjs/common';
import { CreateReqestDto } from './dto/create-reqest.dto';
import { UpdateReqestDto } from './dto/update-reqest.dto';

@Injectable()
export class ReqestsService {
  create(createReqestDto: CreateReqestDto) {
    return 'This action adds a new reqest';
  }

  findAll() {
    return `This action returns all reqests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reqest`;
  }

  update(id: number, updateReqestDto: UpdateReqestDto) {
    return `This action updates a #${id} reqest`;
  }

  remove(id: number) {
    return `This action removes a #${id} reqest`;
  }
}
