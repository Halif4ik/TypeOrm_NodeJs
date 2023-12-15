import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
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
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {UpdateQuizDto} from "./dto/update-quizz.dto";
import {IDeleted, TQuiz} from "../GeneralResponse/interface/customResponces";
import {JwtRoleAdminGuard} from "../auth/jwt-Role-Admin.guard";
import {PaginationsQuizDto} from "./dto/pagination-quiz.dto";
import {DeleteQuizDto} from "./dto/delete-quiz.dto";
import {CompanyDec} from "../auth/decor-company-fromJwt";
import {Company} from "../company/entities/company.entity";


@Controller('quiz')
export class QuizzController {
    constructor(private readonly quizzService: QuizService) {
    }

    //1.Admin and Owner can create quiz
    //Endpoint: Post /quiz/create
    //Permissions: Only Admin and Owner
    @Post('/create')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleAdminGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    createQuiz(@UserDec() userFromGuard: User, @CompanyDec() companyFromGuard: Company,
               @Body() createQuizDto: CreateQuizDto): Promise<GeneralResponse<TQuiz>> {
        return this.quizzService.createQuiz(userFromGuard, createQuizDto, companyFromGuard);
    }

    //2.Admin and Owner can update quiz
    //Endpoint: Patch /quiz/update
    //Permissions: Only Admin and Owner
    @Patch('/update')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleAdminGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    updateQuiz(@UserDec() userFromGuard: User, @Body() updateQuizDto: UpdateQuizDto): Promise<GeneralResponse<TQuiz>> {
        return this.quizzService.updateQuiz(userFromGuard, updateQuizDto);
    }

    //3.Admin and Owner can delete quiz
    //Endpoint: Delete /quiz/delete?id=16
    //Permissions: Only Admin and Owner
    @Delete('/delete')
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleAdminGuard)
    deleteQuiz(@UserDec() userFromGuard: User, @Query() quizDeleteDTO: DeleteQuizDto): Promise<GeneralResponse<IDeleted>> {
        return this.quizzService.deleteQuiz(userFromGuard, quizDeleteDTO);
    }

    //4.Admin and Owner can get all quiz for company
    //Endpoint: Get /quiz/all
    //Permissions: Only Admin and Owner
    @Get('/all')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleAdminGuard)
    getAllQuiz(@Query() paginationsQuizDto: PaginationsQuizDto): Promise<GeneralResponse<TQuiz>> {
        return this.quizzService.findAll(paginationsQuizDto);
    }
}
