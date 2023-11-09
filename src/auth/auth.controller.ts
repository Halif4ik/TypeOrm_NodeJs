import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Headers,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {IResponseUser} from "../user/entities/responce.interface";
import {LoginUserDto} from "./dto/login-auth.dto";
import {JwtAuthRefreshGuard} from "./jwt-Refresh.guard";
import {AuthGuard} from "@nestjs/passport";
import {IResponseAuth} from "./entities/responce-auth.interface";
import {UpdateUserDto} from "../user/dto/update-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(ValidationPipe)
    @Post('/login')
    async login(@Body() loginDto: LoginUserDto): Promise<IResponseAuth> {
        return this.authService.login(loginDto);
    }

    @UsePipes(ValidationPipe)
    @Get("/me")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async userInfo(@Headers('Authorization') authToken: string): Promise<IResponseUser> {
        return this.authService.getUserInfo(authToken);
    }

    @UsePipes(ValidationPipe)
    @Patch("/update")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async updateUserInfo(@Headers('Authorization') authTokenCurrentUser: string, @Body() userData: UpdateUserDto): Promise<IResponseUser> {
        return this.authService.updateUserInfo(authTokenCurrentUser, userData);
    }

    @UsePipes(ValidationPipe)
    @Delete("/delete")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async deleteUser(@Headers('Authorization') authTokenCurrentUser: string, @Body() userData: UpdateUserDto): Promise<IResponseUser> {
        return this.authService.deleteUser(authTokenCurrentUser, userData);
    }

    @UsePipes(ValidationPipe)
    @Post("/registration")
    async registration(@Body() userDto: CreateUserDto): Promise<IResponseUser> {
        return this.authService.registration(userDto);
    }

    @UsePipes(ValidationPipe)
    @Post("/refresh")
    @UseGuards(JwtAuthRefreshGuard)
    async refresh(@Headers('Authorization') authToken: string) {
        return this.authService.refresh(authToken);
    }

}
