import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Query, Param,
} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {AuthGuard} from "@nestjs/passport";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import {PaginationsDto} from "../user/dto/pagination-user.dto";
import {User} from "../user/entities/user.entity";
import {ParsePageAndRevertPipe} from "../pipe/validation.pipe";
import {UserDec} from "../auth/pass-user";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {ICompany, IDeleted} from "../GeneralResponse/interface/customResponces";
import {DeleteUserDto} from "./dto/delete-user-company.dto";

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {
    }

    @UsePipes(ValidationPipe)
    @Post()
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async createCompany(@UserDec() user: User,
                        @Body() companyData: CreateCompanyDto): Promise<GeneralResponse<ICompany>> {
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
    @Delete('/remove_members')/*todo*/
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    removeUserFromCompany(@UserDec() owner: User,@Body() deleteUserDto: DeleteUserDto) {
        return this.companyService.removeUserFromCompany(owner, deleteUserDto);
    }


}
