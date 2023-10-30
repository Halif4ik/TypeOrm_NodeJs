import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
  }
  findAll():Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(user:  Partial<User>) {
    const newUser = this.usersRepository.create(user);

    // Save the new user to the database
    const createdUser = await this.usersRepository.save(newUser);

    const result = {
      "status_code": 200,
      "detail": {
        "user": createdUser
      },
      "result": "working"
    }
    console.log('result-',result);
    return result
  }
  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
