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
import {RolesService} from './roles.service';
import {AssignRoleDto} from './dto/assign-role.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import { IRole} from "../GeneralResponse/interface/customResponces";
import {DeleteCompanyDto} from "../company/dto/delete-company.dto";

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
    assignAdmin(@UserDec() owner: User, @Body() assignRoleDto: AssignRoleDto):Promise<GeneralResponse<IRole>> {
        return this.rolesService.assignAdmin(owner, assignRoleDto);
    }

    // 2. Owner removes the admin role from  this company
    // Endpoint: DELETE /roles/remove_admin
    // Permissions: Only company owner
    @Delete('/remove_admin')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    removeAdmin(@UserDec() owner: User, @Body() assignRoleDto: AssignRoleDto):Promise<GeneralResponse<IRole>> {
        return this.rolesService.removeAdmin(owner, assignRoleDto);
    }
    // 3. Show all Admins for this company
    // Endpoint: GET /roles/admins
    // Permissions: Only company owner
    @Get('/admins')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    showAllAdmins(@UserDec() owner: User, @Query() companyId: DeleteCompanyDto):Promise<GeneralResponse<IRole>> {
        return this.rolesService.showAllAdmins(owner, companyId.id);
    }

}
