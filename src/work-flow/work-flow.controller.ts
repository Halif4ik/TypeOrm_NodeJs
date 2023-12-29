import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Query, Res, StreamableFile, HttpException, HttpStatus
} from '@nestjs/common';
import {WorkFlowService} from './work-flow.service';
import {CreateWorkFlowDto} from './dto/create-work-flow.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {AdditionalUpdateQuizId, GetRedisQuizDto, GetRedisAllQuizDto} from "../quizz/dto/update-quizz.dto";
import {TAnswers, TPassedQuiz, TRedisData,} from "../GeneralResponse/interface/customResponces";
import {JwtRoleMemberGuard} from "../auth/jwt-Role-Member.guard";
import type {Response} from 'express';
import {createReadStream} from 'fs';
import {join} from 'path';
import {Readable} from 'stream';
import {JwtRoleAdminGuard} from "../auth/jwt-Role-Admin.guard";
import {Roles} from "../auth/role-auth-decor";
import {UserRole} from "../roles/entities/role.entity";

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
    async exportQuiz(@UserDec() userFromGuard: User, @Query() getRedisQuizDto: GetRedisQuizDto,
                     @Res({passthrough: true}) res: Response): Promise<StreamableFile> {
        const csvContent: string  = await this.workFlowService.exportQuizDataFromRedis(userFromGuard, getRedisQuizDto);
        if (csvContent.indexOf('{"') == 0) {
            res.set({
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${userFromGuard.email}.json"`,
            });
            return new StreamableFile(Readable.from([csvContent]));
        } else {
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${userFromGuard.email}.csv"`,
            });
            return new StreamableFile(Readable.from([csvContent]));
        }
    }
    //4. Endpoint: Get /work-flow/export-user/?format=json&userId=6&companyId=1
    //  Permissions: Admin or owner of the company
    @Get('/export-user')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleAdminGuard)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    async exportUser(@UserDec() userFromGuard: User, @Query() getRedisAllQuizDto: GetRedisAllQuizDto,
                     @Res({passthrough: true}) res: Response): Promise<StreamableFile> {
        const csvContent: string  = await this.workFlowService.exportUserDataFromRedis(userFromGuard, getRedisAllQuizDto);
        if (csvContent.indexOf('{"') === 0) {
            res.set({
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${userFromGuard.email}.json"`,
            });
            return new StreamableFile(Readable.from([csvContent]));
        } else {
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${userFromGuard.email}.csv"`,
            });
            return new StreamableFile(Readable.from([csvContent]));
        }
    }


}
