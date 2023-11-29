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
import {UserDec} from "./decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IRespAuth, IUserInfo} from "../GeneralResponse/interface/customResponces";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(ValidationPipe)
    @Post('/login')
    async login(@Body() loginDto: LoginUserDto):Promise<GeneralResponse<IRespAuth>> {
        return this.authService.login(loginDto);
    }

    @UsePipes(ValidationPipe)
    @Get("/me")
    /*@CurrentUser() user: JwtPayload*/
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async userInfo(@UserDec() userFromGuard: User): Promise<GeneralResponse<IUserInfo>> {
        return this.authService.getUserInfo(userFromGuard);
    }

    @UsePipes(ValidationPipe)
    @Post("/registration")
    async registration(@Body() userDto: CreateUserDto): Promise<GeneralResponse<IUserInfo>> {
        return this.authService.registration(userDto);
    }

    @UsePipes(ValidationPipe)
    @Post("/refresh")
    @UseGuards(JwtAuthRefreshGuard)
    async refresh(@UserDec() userFromGuard: User): Promise<GeneralResponse<IRespAuth>> {
        return this.authService.refresh(userFromGuard);
    }

}
