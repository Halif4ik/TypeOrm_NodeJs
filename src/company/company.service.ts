import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Company} from "./entities/company.entity";
import {IResponseCompany} from "./entities/responce-company.interface";
import {User} from "../user/entities/user.entity";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import * as process from "process";

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private jwtService: JwtService, private userService: UserService,
                @InjectRepository(Company) private companyRepository: Repository<Company>) {
    }

    async create(token: string, companyData: CreateCompanyDto): Promise<IResponseCompany> {
        const fetureOwnerFromBd: User = await this.tookUserFromBd(token);
        const newCompany: Company = this.companyRepository.create({...companyData, owner: fetureOwnerFromBd});
        const result: IResponseCompany = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": await this.companyRepository.save(newCompany),
            },
            "result": "working"
        }
        this.logger.log(`Created new company- ${newCompany.name}`);
        return result;
    }

    async update(token: string, updateCompanyData: UpdateCompanyDto): Promise<IResponseCompany> {
        const ownerFromBd: User = await this.tookUserFromBd(token);
        let findedCompany: Company = ownerFromBd.company.find((company: Company): boolean => company.id === updateCompanyData.id);
        if (!findedCompany) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);
        await this.companyRepository.update({id: updateCompanyData.id}, updateCompanyData);

        findedCompany = {...findedCompany, owner: null, ...updateCompanyData}
        const result: IResponseCompany = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": findedCompany,
            },
            "result": "working"
        }
        this.logger.log(`Changed name/description for new-'${updateCompanyData.name}' company`);
        return result;

    }

    async delete(authTokenCurrentUser: string, deleteCompanyData: DeleteCompanyDto): Promise<IResponseCompany> {
        const userFromToken = this.jwtService.decode(authTokenCurrentUser.slice(7));
        if (!userFromToken['email']) throw new UnauthorizedException({message: "Incorrect credentials for delete company"});
        const ownerFromBd:User = await this.userService.getUserByEmailWithCompanyId(userFromToken['email'],deleteCompanyData.id);
        if (!ownerFromBd) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);

        const findedCompany: Company = ownerFromBd.company[0];

         await this.companyRepository.softDelete(findedCompany.id);

        const result: IResponseCompany = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": findedCompany,
            },
            "result": "working"
        }

        this.logger.log(`Soft-deleted company -'${findedCompany.name}'=)`);
        return result;
    }

    private async tookUserFromBd(token: string): Promise<User> {
        const userFromToken = this.jwtService.decode(token.slice(7));
        if (!userFromToken['email']) throw new UnauthorizedException({message: "Incorrect credentials for updateUserInfo"});
        return this.userService.getUserByEmailWithCompany(userFromToken['email']);

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
