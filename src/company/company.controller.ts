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
    Headers, Query
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

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {
    }


    @UsePipes(ValidationPipe)
    @Post()
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async createCompany(@Headers('Authorization') authTokenCurrentUser: string, @Body() companyData: CreateCompanyDto): Promise<IResponseCompany> {
        return this.companyService.create(authTokenCurrentUser, companyData);
    }

    @UsePipes(ValidationPipe)
    @Patch("/update")
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async updateCompanyInfo(@Headers('Authorization') authTokenCurrentUser: string, @Body() updateCompanyData: UpdateCompanyDto): Promise<IResponseCompany> {
        return this.companyService.update(authTokenCurrentUser, updateCompanyData);
    }

    @UsePipes(ValidationPipe)
    @Delete()
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    async deleteCompany(@Headers('Authorization') authTokenCurrentUser: string,
                        @Body() deleteCompanyData: DeleteCompanyDto): Promise<IResponseCompany> {
        return this.companyService.delete(authTokenCurrentUser, deleteCompanyData);
    }

    @UsePipes(ValidationPipe)
    @Get()
    async findAll(@Query() query: PaginationsDto): Promise<Company[]> {
        const {page, revert} = query;
        return this.companyService.findAll(page, revert);
    }

}
