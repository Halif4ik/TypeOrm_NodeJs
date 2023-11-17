import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {UserService} from "../user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Company} from "./entities/company.entity";
import {IResponseCompanyOrUser} from "./entities/responce-company.interface";
import {User} from "../user/entities/user.entity";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import * as process from "process";

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {
    }

    async create(user: User, companyData: CreateCompanyDto): Promise<IResponseCompanyOrUser> {
        const newCompany: Company = this.companyRepository.create({...companyData, owner: user});
        this.logger.log(`Created new company- ${newCompany.name}`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "company": await this.companyRepository.save(newCompany),
            },
            "result": "create"
        };
    }

    async update(userFromGuard: User, updateCompanyData: UpdateCompanyDto): Promise<IResponseCompanyOrUser> {
        let findedCompany: Company = userFromGuard.company.find((company: Company): boolean => company.id === updateCompanyData.id);
        if (!findedCompany) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);
        await this.companyRepository.update({id: updateCompanyData.id}, updateCompanyData);

        findedCompany = {...findedCompany, owner: null, ...updateCompanyData}
        this.logger.log(`Changed name/description for new-'${updateCompanyData.name}' company`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "company": findedCompany,
            },
            "result": "update"
        };

    }

    async delete(userFromGuard: User, deleteCompanyData: DeleteCompanyDto): Promise<IResponseCompanyOrUser> {
        let findedCompany: Company = userFromGuard.company.find((company: Company) => company.id === deleteCompanyData.id);
        if (!findedCompany) throw new HttpException("Incorrect company id for this user for delete", HttpStatus.NOT_FOUND);
        await this.companyRepository.softDelete(findedCompany.id);

        this.logger.log(`Soft-deleted company -'${findedCompany.name}'=)`);
        return {
            "status_code": HttpStatus.OK,
            "result": "deleted"
        };
    }

    async findAll(needPage: number, revert: boolean): Promise<Company[]> {
        if (needPage < 0) needPage = 1;
        const order = revert === true ? 'ASC' : 'DESC';
        return this.companyRepository.find({
            take: +process.env.PAGE_PAGINATION,
            skip: (+needPage - 1) * (+process.env.PAGE_PAGINATION),
            order: {
                id: order,
            },
            relations: ["owner"],
        });
    }


}
