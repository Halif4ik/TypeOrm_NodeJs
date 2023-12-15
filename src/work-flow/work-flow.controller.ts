import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { WorkFlowService } from './work-flow.service';
import { CreateWorkFlowDto } from './dto/create-work-flow.dto';
import { UpdateWorkFlowDto } from './dto/update-work-flow.dto';
import {AuthGuard} from "@nestjs/passport";
import {JwtRoleAdminGuard} from "../auth/jwt-Role-Admin.guard";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TQuiz} from "../GeneralResponse/interface/customResponces";

@Controller('work-flow')
export class WorkFlowController {
  constructor(private readonly workFlowService: WorkFlowService) {}

  @Post('/answer')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  create(@UserDec() userFromGuard: User, @Body() createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<any>> {
    return this.workFlowService.create(userFromGuard,createWorkFlowDto);
  }


}
