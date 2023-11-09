import {Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {IResponseUser} from "../user/entities/responce.interface";
import {LoginUserDto} from "./dto/login-auth.dto";
import {User} from "../user/entities/user.entity";
import {JwtAuthRefreshGuard} from "./jwt-Refresh.guard";
import {Auth} from "./entities/auth.entity";
import {AuthGuard} from "@nestjs/passport";
import {IResponseAuth} from "./entities/responce-auth.interface";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/login')
    async login(@Body() loginDto: LoginUserDto): Promise<IResponseAuth> {
        return this.authService.login(loginDto);
    }

    @Get("/me")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async userInfo(@Headers('Authorization') authToken: string):Promise<IResponseUser> {
        return this.authService.getUserInfo(authToken);
    }

    @Post("/registration")
    async registration(@Body() userDto: CreateUserDto): Promise<IResponseUser> {
        return this.authService.registration(userDto);
    }

    @Post("/refresh")
    @UseGuards(JwtAuthRefreshGuard)
    async refresh(@Headers('Authorization') authToken: string){
        return this.authService.refresh(authToken);
    }

}
