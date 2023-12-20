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
import {AdditionalUpdateQuizId} from "../quizz/dto/update-quizz.dto";
import {QuizService} from "../quizz/quizService";
import {TPassedQuiz, TQuiz} from "../GeneralResponse/interface/customResponces";

@Controller('work-flow')
export class WorkFlowController {
    constructor(private readonly workFlowService: WorkFlowService) {
    }

    //1.Logged users can start some  quiz for checked company
    //Endpoint: Get /work-flow/start?quiz=1
    //Permissions: All logged Users
    @Get('/start')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    start(@UserDec() userFromGuard: User, @Query() quizIdDto: AdditionalUpdateQuizId): Promise<GeneralResponse<TPassedQuiz>> {
        return this.workFlowService.start(userFromGuard, quizIdDto.quizId);
    }

    //2.Logged users can send answer for some started quiz for checked company
    //Endpoint: Post /work-flow/answer
    //Permissions: All logged Users
    @Post('/answer')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    createAnswers(@UserDec() userFromGuard: User, @Body() createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<any>> {
        return this.workFlowService.createAnswers(userFromGuard, createWorkFlowDto);
    }


}
