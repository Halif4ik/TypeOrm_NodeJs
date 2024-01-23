import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {AnaliticService} from './analitic.service';
import {CreateAnaliticDto} from './dto/create-analitic.dto';
import {UpdateAnaliticDto} from './dto/update-analitic.dto';
import {AuthGuard} from "@nestjs/passport";
import {JwtRoleMemberGuard} from "../auth/jwt-Role-Member.guard";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TGeneralRating} from "../GeneralResponse/interface/customResponces";

@Controller('analitic')
export class AnaliticController {
    constructor(private readonly analiticService: AnaliticService) {
    }

    //1.Logged users can get average rating for checked company
    //Endpoint: Get /analitic/my-general-rating
    //Permissions: All logged users
    @Get('/my-general-rating')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    getMyGeneralRating(@UserDec() userFromGuard: User):Promise<GeneralResponse<TGeneralRating>>{
        return this.analiticService.getMyGeneralRating(userFromGuard);
    }

}

