import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {UserService} from "../user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Company} from "./entities/company.entity";
import {User} from "../user/entities/user.entity";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import * as process from "process";
import {ICompany, IDeleted} from "../GeneralResponse/interface/customResponces";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {
    }

    async create(user: User, companyData: CreateCompanyDto): Promise<GeneralResponse<ICompany>> {
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

    async update(userFromGuard: User, updateCompanyData: UpdateCompanyDto): Promise<GeneralResponse<ICompany>> {
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

    async delete(userFromGuard: User, deleteCompanyData: DeleteCompanyDto): Promise<GeneralResponse<IDeleted>> {
        let findedCompany: Company = userFromGuard.company.find((company: Company) => company.id === deleteCompanyData.id);
        if (!findedCompany) throw new HttpException("Incorrect company id for this user for delete", HttpStatus.NOT_FOUND);
        await this.companyRepository.softDelete(findedCompany.id);

        this.logger.log(`Soft-deleted company -'${findedCompany.name}'=)`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "company": null,
            },
            "result": "deleted"
        };
    }

    async findAll(needPage: number, revert: boolean): Promise<GeneralResponse<ICompany>> {
        if (needPage < 0) needPage = 1;
        const order = revert === true ? 'ASC' : 'DESC';
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "company": await this.companyRepository.find({
                    take: +process.env.PAGE_PAGINATION,
                    skip: (+needPage - 1) * (+process.env.PAGE_PAGINATION),
                    order: {
                        id: order,
                    },
                    relations: ["owner"],
                }),
            },
            "result": "deleted"
        };

    }

     async getCompanyById(companyId: number):Promise<Company | undefined> {
        return  this.companyRepository.findOne({where: {id: companyId}});
    }
}
