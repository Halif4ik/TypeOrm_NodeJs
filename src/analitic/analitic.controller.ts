import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Query
} from '@nestjs/common';
import {AnaliticService} from './analitic.service';
import {CreateAnaliticDto} from './dto/create-analitic.dto';
import {UpdateAnaliticDto} from './dto/update-analitic.dto';
import {AuthGuard} from "@nestjs/passport";
import {JwtRoleMemberGuard} from "../auth/jwt-Role-Member.guard";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TAvgRating, TGeneralRating} from "../GeneralResponse/interface/customResponces";
import {AdditionalUpdateQuizCompanyId} from "../quizz/dto/update-quizz.dto";

@Controller('analitic')
export class AnaliticController {
    constructor(private readonly analiticService: AnaliticService) {
    }

    //1.Logged users can get GENERAL average rating for checked company
    //Endpoint: Get /analitic/my-general-rating
    //Permissions: All logged users
    @Get('/my-general-rating')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    getMyGeneralRating(@UserDec() userFromGuard: User): Promise<GeneralResponse<TGeneralRating>> {
        return this.analiticService.getMyGeneralRating(userFromGuard);
    }

    //2.Logged users can get average rating for ALL company
    //Endpoint: Get /analitic/avg-rating
    //Permissions: All logged users
    @Get('/avg-rating')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    getAvgRating(@UserDec() userFromGuard: User): Promise<GeneralResponse<TAvgRating>> {
        return this.analiticService.getAvgRating(userFromGuard);
    }


}

