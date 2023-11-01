import {
    Body,
    Controller, Delete,
    Get,
    Param, Patch,
    Post, Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./entities/user.entity";
import {IResponse} from "./entities/responce.interface";
import {UpdateUserDto} from "./dto/update-user.dto";
import {PaginationsUserDto} from "./dto/pagination-user.dto";
import {RemoveUserDto} from "./dto/remove-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    findAll(@Query() query: PaginationsUserDto): Promise<User[]> {
        const {page, revert} = query;
        return this.userService.findAll(page, revert);
    }

    //create user
    @UsePipes(ValidationPipe)
    @Post()
     create(@Body() createUserDto: CreateUserDto):Promise<IResponse> {
      return this.userService.create(createUserDto);
    }

    //get user by id
    @Get(':id')
     findOne(@Param('id') id: number): Promise<IResponse> {
        return  this.userService.findOne(id);
    }

    @Patch()
    async update(@Body() userData: UpdateUserDto): Promise<IResponse> {
        return this.userService.update(userData);
    }

    @Delete()
     remove(@Query() emailQuery: RemoveUserDto):Promise<IResponse> {
        const {email} = emailQuery;
        return  this.userService.remove(email)
    }
}
