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

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}


  @UsePipes(ValidationPipe)
  @Post()
  @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
  async createCompany(@Headers('Authorization') authTokenCurrentUser: string, @Body() companyData: CreateCompanyDto) {
    return this.companyService.create(authTokenCurrentUser, companyData);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
