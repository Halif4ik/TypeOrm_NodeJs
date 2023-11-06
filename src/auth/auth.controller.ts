import {Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {IResponse} from "../user/entities/responce.interface";
import {LoginUserDto} from "./dto/login-auth.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "../user/entities/user.entity";
import {JwtAuthRefreshGuard} from "./jwt-Refresh.guard";
import {Auth0Guard} from "./Auth0.guard";
import {Auth} from "./entities/auth.entity";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
    @Post('/login')
    login(@Body() loginDto: LoginUserDto):Promise<Auth> {
        return this.authService.login(loginDto);
    }

    @Post("/registration")
    registration(@Body() userDto: CreateUserDto): Promise<IResponse> {
        return this.authService.registration(userDto);
    }

    @Get("/me")
    @UseGuards(JwtAuthGuard)
    @UseGuards(Auth0Guard)
    userInfo(@Headers('Authorization') authToken: string): Promise<User> {
        return this.authService.getUserInfo(authToken);
    }

    @Post("/refresh")
    @UseGuards(JwtAuthRefreshGuard)
    refresh(@Headers('Authorization') authToken: string): Promise<Auth> {
        return this.authService.refresh(authToken);
    }

}
