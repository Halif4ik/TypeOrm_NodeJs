import {
    Body,
    Controller,
    Get,
    HttpException, HttpStatus,
    NotFoundException,
    Param, Patch,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./entities/user.entity";
import {IResponse} from "./entities/responce.interface";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    //create user
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Body() user: User):Promise<IResponse> {
        const createdUser: User = await this.userService.create(user);
        const result: IResponse = {
            "status_code": 200,
            "detail": {
                "user": createdUser
            },
            "result": "working"
        }
        return result
    }

    //get user by id
    @Get(':id')
    async findOne(@Param('id') id: number):Promise<User> {
        const user: User | null = await this.userService.findOne(id);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
            /*throw new NotFoundException('User does not exist!');*/
        } else {
            return user;
        }
    }


      @Patch()
      async update( @Body() userData: UpdateUserDto):Promise<IResponse> {
          return this.userService.update(userData);
      }
/*
      @Delete(':id')
      remove(@Param('id') id: string) {
        return this.userService.remove(+id);
      }*/
}
