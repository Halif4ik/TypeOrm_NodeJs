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
import {QuizService} from './quizService';
import {CreateQuizDto} from './dto/create-quiz.dto';
import {Roles} from "../auth/role-auth-decor";
import {UserRole} from "../roles/entities/role.entity";
import {JwtRoleGuard} from "../auth/jwt-Role.guard";
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {UpdateQuizDto} from "./dto/update-quizz.dto";
import {Quiz} from "./entities/quizz.entity";
import {TQuiz} from "../GeneralResponse/interface/customResponces";
import {DeleteCompanyDto} from "../company/dto/delete-company.dto";
import {JwtRoleAdminGuard} from "../auth/jwt-Role-Admin.guard";


@Controller('quiz')
export class QuizzController {
    constructor(private readonly quizzService: QuizService) {
    }

    //1.Admin and Owner can create quiz
    //Endpoint: Post /quiz/create
    //Permissions: Only Admin and Owner
    @Post('/create')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    createQuiz(@UserDec() userFromGuard: User, @Body() createQuizDto: CreateQuizDto): Promise<GeneralResponse<TQuiz>> {
        return this.quizzService.createQuiz(userFromGuard, createQuizDto);
    }

    //2.Admin and Owner can update quiz
    //Endpoint: Patch /quiz/update
    //Permissions: Only Admin and Owner TODO
    @Patch('/update')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    updateQuiz(@UserDec() userFromGuard: User, @Body() updateQuizDto: UpdateQuizDto):Promise<GeneralResponse<TQuiz>> {
        return this.quizzService.updateQuiz(userFromGuard, updateQuizDto);
    }

    //3.Admin and Owner can delete quiz
    //Endpoint: Delete /quiz/delete?id=16
    //Permissions: Only Admin and Owner TODO
    @Delete('/delete')
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleGuard)
    deleteQuiz(@UserDec() userFromGuard: User, @Query() quizDeleteDTO: DeleteCompanyDto) {
        return this.quizzService.deleteQuiz(userFromGuard, quizDeleteDTO);
    }
    //4.Admin and Owner can get all quiz
    //Endpoint: Get /quiz/all
    //Permissions: Only Admin and Owner TODO JwtRoleAdminGuard
    @Get('/all')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleGuard)
    getAllQuiz(@UserDec() userFromGuard: User, @Query('page') page: number, @Query('revert') revert: boolean) {
        console.log('/all',userFromGuard);
        return this.quizzService.findAll();
    }
}
