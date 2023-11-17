import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {LoginUserDto} from "./dto/login-auth.dto";
import {JwtAuthRefreshGuard} from "./jwt-Refresh.guard";
import {AuthGuard} from "@nestjs/passport";
import {IResponseAuth} from "./entities/responce-auth.interface";
import {UserDec} from "./pass-user";
import {User} from "../user/entities/user.entity";
import {IResponseCompanyOrUser} from "../company/entities/responce-company.interface";

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
    /*@CurrentUser() user: JwtPayload*/
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async userInfo(@UserDec() userFromGuard: User): Promise<IResponseCompanyOrUser> {
        return this.authService.getUserInfo(userFromGuard);
    }

    @UsePipes(ValidationPipe)
    @Post("/registration")
    async registration(@Body() userDto: CreateUserDto): Promise<IResponseCompanyOrUser> {
        return this.authService.registration(userDto);
    }

    @UsePipes(ValidationPipe)
    @Post("/refresh")
    @UseGuards(JwtAuthRefreshGuard)
    async refresh(@UserDec() userFromGuard: User): Promise<IResponseAuth> {
        return this.authService.refresh(userFromGuard);
    }

}
