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
  Headers
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {AuthGuard} from "@nestjs/passport";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {IResponseUser} from "../user/entities/responce.interface";
import {IResponseCompany} from "./entities/responce-company.interface";

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}


  @UsePipes(ValidationPipe)
  @Post()
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  async createCompany(@Headers('Authorization') authTokenCurrentUser: string, @Body() companyData: CreateCompanyDto): Promise<IResponseCompany> {
    return this.companyService.create(authTokenCurrentUser, companyData);
  }

  @UsePipes(ValidationPipe)
  @Patch("/update")
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  async updateUserInfo(@Headers('Authorization') authTokenCurrentUser: string, @Body() updateCompanyData: UpdateCompanyDto) {
    return this.companyService.update(authTokenCurrentUser, updateCompanyData);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
