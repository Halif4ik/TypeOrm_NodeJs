import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserInfoDto} from "./dto/get-userInfo.dto";
import {IResponse} from "../user/entities/responce.interface";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    @Post("/registration")
    registration(@Body() userDto: CreateUserDto):Promise<IResponse> {
        return this.authService.registration(userDto);
    }

    @Get("/me")
    userInfo(@Query() userInfoDto: UserInfoDto) {
        const {token} = userInfoDto;
        return this.authService.getUserInfo(token);
    }

  /*  @Post("/refresh")
    refresh(@Body() userDto: CreateUserDto): Promise<{token: string}> {
        return this.authService.registration(userDto);
    }*/

}
