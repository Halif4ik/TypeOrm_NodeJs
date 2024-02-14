import {Body, Controller, Delete, Get, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe,} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {AuthGuard} from "@nestjs/passport";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import {PaginationsDto} from "../user/dto/pagination-user.dto";
import {User} from "../user/entities/user.entity";
import {ParsePageAndRevertPipe} from "../pipe/validation.pipe";
import {UserDec} from "../auth/decor-pass-user";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IAllMembers, ICompany, IDeleted} from "../GeneralResponse/interface/customResponces";
import {DeleteUserDto} from "./dto/delete-user-company.dto";
import {RemoveMembershipDto} from "./dto/remove-membership-company.dto";

@Controller('company')
export class CompanyController {
   constructor(private readonly companyService: CompanyService) {
   }

   @UsePipes(ValidationPipe)
   @Post()
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
   async createCompany(@UserDec() user: User, @Body() companyData: CreateCompanyDto): Promise<GeneralResponse<ICompany>> {
      return this.companyService.create(user, companyData);
   }

   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   @Patch("/update")
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
   async updateCompanyInfo(@UserDec() userFromGuard: User,
                           @Body() updateCompanyData: UpdateCompanyDto): Promise<GeneralResponse<ICompany>> {
      return this.companyService.update(userFromGuard, updateCompanyData);
   }

   @Delete()
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
   async deleteCompany(@UserDec() userFromGuard: User,
                       @Body() deleteCompanyData: DeleteCompanyDto): Promise<GeneralResponse<IDeleted>> {
      return this.companyService.delete(userFromGuard, deleteCompanyData);
   }


   @Get()
   @UsePipes(new ParsePageAndRevertPipe())
   async findAll(@Query() paginationsDto: PaginationsDto): Promise<GeneralResponse<ICompany>> {
      const {page, revert} = paginationsDto;
      return this.companyService.findAll(page, revert);
   }

   // 9. Owner removes a user from the company
   // Endpoint: DELETE /company/remove_members
   // Permissions: Only company owner
   @Delete('/remove_members')
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   removeUserFromCompany(@UserDec() owner: User, @Body() deleteUserDto: DeleteUserDto): Promise<GeneralResponse<IDeleted>> {
      return this.companyService.removeUserFromCompany(owner, deleteUserDto);
   }

   // 10. User leaves the company
   // Endpoint: DELETE /company/membership_remove
   // Permissions: Authenticated user
   @Delete('/membership_remove')
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   leaveCompany(@UserDec() user: User, @Body() removeMembershipDto: RemoveMembershipDto): Promise<GeneralResponse<IDeleted>> {
      return this.companyService.removeMembership(user, removeMembershipDto);
   }

   // 15. List users in my company
   // Endpoint: GET /company/all_members
   // Permissions: Authenticated all users
   @Get('/all_members')
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
   listAllMembersOfCompany(@Query() idCompanyDto: DeleteCompanyDto): Promise<GeneralResponse<IAllMembers>> {
      return this.companyService.listAllMembersOfCompany(idCompanyDto);
   }

}
