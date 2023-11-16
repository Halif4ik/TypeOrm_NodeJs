import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Headers, Query, ParseIntPipe, ParseBoolPipe
} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {AuthGuard} from "@nestjs/passport";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {IResponseUser} from "../user/entities/responce.interface";
import {IResponseCompany} from "./entities/responce-company.interface";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import {PaginationsDto} from "../user/dto/pagination-user.dto";
import {User} from "../user/entities/user.entity";
import {Company} from "./entities/company.entity";
import {ParsePageAndRevertPipe} from "../pipe/validation.pipe";
import {UserDec} from "../auth/pass-user";

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {
    }


    @UsePipes(ValidationPipe)
    @Post()
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async createCompany(@UserDec() user: User,
                        @Body() companyData: CreateCompanyDto): Promise<IResponseCompany> {
        return this.companyService.create(user, companyData);
    }

    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    @Patch("/update")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async updateCompanyInfo(@UserDec() userFromGuard: User,
                            @Body() updateCompanyData: UpdateCompanyDto): Promise<IResponseCompany> {
        return this.companyService.update(userFromGuard, updateCompanyData);
    }

    @Delete()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async deleteCompany(@UserDec() userFromGuard: User,
                        @Body() deleteCompanyData: DeleteCompanyDto): Promise<IResponseCompany> {
        return this.companyService.delete(userFromGuard, deleteCompanyData);
    }


    @Get()
    @UsePipes(new ParsePageAndRevertPipe())
    async findAll(@Query() paginationsDto: PaginationsDto): Promise<Company[]> {
        const { page, revert } = paginationsDto;
        return this.companyService.findAll(page, revert);
    }

}
