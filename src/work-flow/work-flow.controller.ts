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
import {WorkFlowService} from './work-flow.service';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {PaginationsQuizDto} from "../quizz/dto/pagination-quiz.dto";
import {AdditionalUpdateQuizId, GetRedisQuizDto} from "../quizz/dto/update-quizz.dto";
import {QuizService} from "../quizz/quizService";
import {TAnswers, TPassedQuiz, TQuiz} from "../GeneralResponse/interface/customResponces";
import {JwtRoleMemberGuard} from "../auth/jwt-Role-Member.guard";

@Controller('work-flow')
export class WorkFlowController {
    constructor(private readonly workFlowService: WorkFlowService) {
    }

    //1.Logged users can start some  quiz for checked company
    //Endpoint: Get /work-flow/start?quiz=1
    //Permissions: Only members
    @Get('/start')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleMemberGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    start(@UserDec() userFromGuard: User, @Query() quizIdDto: AdditionalUpdateQuizId): Promise<GeneralResponse<TPassedQuiz>> {
        return this.workFlowService.start(userFromGuard, quizIdDto.quizId);
    }

    //2.Logged users can send answer for some started quiz for checked company
    //Endpoint: Post /work-flow/answer
    //Permissions: All member Users who started quiz
    @Post('/answer')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleMemberGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    createAnswers(@UserDec() userFromGuard: User, @Body() createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<TAnswers>> {
        return this.workFlowService.createAnswers(userFromGuard, createWorkFlowDto);
    }

    //3. Endpoint: Get /work-flow/export/?format=json&quizId=1
    //  Permissions: Admin or the user whose data is being exported
    @Get('/export')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleMemberGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    async exportQuiz(@UserDec() userFromGuard: User, @Query() getRedisQuizDto: GetRedisQuizDto) {
        return this.workFlowService.exportQuizDataFromRedis(userFromGuard, getRedisQuizDto);
    }


}
