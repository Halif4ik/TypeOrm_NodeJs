import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./entities/user.entity";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() user: User) {
    return  this.userService.create(user);
  }

/*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }*/

/*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }*/
}
