import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { RolesService } from './roles.service';
import {AssignRoleDto} from './dto/assign-role.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {DeleteUserDto} from "../company/dto/delete-user-company.dto";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted} from "../GeneralResponse/interface/customResponces";

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {

  }

  // 1. Owner assign admin role for user from this company
  // Endpoint: Post /roles/assign_admin
  // Permissions: Only company owner
  @Post('/assign_admin')
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
  assignAdmin(@UserDec() owner: User,@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignAdmin(owner,assignRoleDto);
  }

}
