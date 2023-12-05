import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {QuizzService} from './quizz.service';
import {CreateQuizzDto} from './dto/create-quizz.dto';
import {Roles} from "../auth/role-auth-decor";
import {UserRole} from "../roles/entities/role.entity";
import {JwtRoleGuard} from "../auth/jwt-Role.guard";

@Controller('quiz')
export class QuizzController {
    constructor(private readonly quizzService: QuizzService) {
    }
    //1.Admin and Owner can create quiz
    //Endpoint: Post /quiz/create
    //Permissions: Only Admin and Owner
    @Post('/create')
    @Roles(UserRole.ADMIN, 'owner')
    @UseGuards(JwtRoleGuard)
    createQuiz(@Body() createQuizzDto: CreateQuizzDto) {
        return this.quizzService.createQuiz(createQuizzDto);
    }

}
