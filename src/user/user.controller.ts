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
import {IResponseUser} from "./entities/responce.interface";
import {UpdateUserDto} from "./dto/update-user.dto";
import {PaginationsUserDto} from "./dto/pagination-user.dto";
import {RemoveUserDto} from "./dto/remove-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    async findAll(@Query() query: PaginationsUserDto): Promise<User[]> {
        const {page, revert} = query;
        return this.userService.findAll(page, revert);
    }

    //create user
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<IResponseUser> {
        return this.userService.createUser(createUserDto);
    }

    //get user by id doesn't return Genaral responce brkose it will be private method
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @UsePipes(ValidationPipe)
    @Patch()
    async update(@Body() userData: UpdateUserDto): Promise<IResponseUser> {
        return this.userService.update(userData);
    }

    @UsePipes(ValidationPipe)
    @Delete()
    async remove(@Query() emailQuery: RemoveUserDto): Promise<IResponseUser> {
        const {email} = emailQuery;
        return this.userService.remove(email)
    }
}
