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
import {UpdateUserDto} from "../user/dto/update-user.dto";

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
    async userInfo(@Headers('Authorization') authToken: string): Promise<IResponseUser> {
        return this.authService.getUserInfo(authToken);
    }

    @Patch("/update")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async updateUserInfo(@Headers('Authorization') authToken: string, @Body() userData: UpdateUserDto): Promise<IResponseUser> {
        return this.authService.updateUserInfo(authToken,userData);
    }

    @Post("/registration")
    async registration(@Body() userDto: CreateUserDto): Promise<IResponseUser> {
        return this.authService.registration(userDto);
    }

    @Post("/refresh")
    @UseGuards(JwtAuthRefreshGuard)
    async refresh(@Headers('Authorization') authToken: string) {
        return this.authService.refresh(authToken);
    }

}
