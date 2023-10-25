import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";

@Injectable()
export class UserService {
  @InjectRepository(User)

  findAll() {
    return `This action returns a ALL users`;
  }

}
