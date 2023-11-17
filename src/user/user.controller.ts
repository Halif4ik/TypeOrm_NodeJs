import {
    Body,
    Controller, Delete,
    Get, Headers,
    Param, Patch,
    Post, Query, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./entities/user.entity";
import {UpdateUserDto} from "./dto/update-user.dto";
import {PaginationsDto} from "./dto/pagination-user.dto";
import {RemoveUserDto} from "./dto/remove-user.dto";
import {AuthGuard} from "@nestjs/passport";
import {IResponseCompanyOrUser} from "../company/entities/responce-company.interface";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    async findAll(@Query() query: PaginationsDto): Promise<User[]> {
        const {page, revert} = query;
        return this.userService.findAll(page, revert);
    }

    //create user
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<IResponseCompanyOrUser> {
        return this.userService.createUser(createUserDto);
    }

    //get user by id doesn't return Genaral responce because it will be private method perhaps
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @UsePipes(ValidationPipe)
    @Patch("/update")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async updateUserInfo(@Headers('Authorization') authTokenCurrentUser: string, @Body() userData: UpdateUserDto):Promise<IResponseCompanyOrUser> {
        return this.userService.updateUserInfo(authTokenCurrentUser,userData);
    }

    @UsePipes(ValidationPipe)
    @Delete()
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async deleteUser(@Headers('Authorization') authTokenCurrentUser: string, @Body() userData: UpdateUserDto): Promise<IResponseCompanyOrUser> {
      return this.userService.deleteUser(authTokenCurrentUser, userData);
    }

}
