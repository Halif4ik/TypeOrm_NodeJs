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

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private jwtService: JwtService, private userService: UserService,
                @InjectRepository(Company) private companyRepository: Repository<Company>) {
    }

    async create(token: string, companyData: CreateCompanyDto): Promise<IResponseCompany> {
        const fetureOwnerFromBd: User = await this.tookUserFromBd(token);
        const findedCompany:Company = fetureOwnerFromBd.company.find((company: Company):boolean => company.name === companyData.name);
        if (findedCompany) throw new HttpException("Company with this name present in current user", HttpStatus.CONFLICT);
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

        const findedCompany:Company = ownerFromBd.company.find((company: Company):boolean => company.name === updateCompanyData.oldName);
        if (!findedCompany) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);
        if (updateCompanyData.newName) findedCompany.name = updateCompanyData.newName;
        if (updateCompanyData.description) findedCompany.description = updateCompanyData.description;
        let deleteOwnerFromResult: Company = await this.companyRepository.save(findedCompany);
        deleteOwnerFromResult = {...deleteOwnerFromResult, owner: null}
        const result: IResponseCompany = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": deleteOwnerFromResult,
            },
            "result": "working"
        }

        this.logger.log(`Changed name/description for-'${updateCompanyData.oldName}' company`);
        return result;

    }

    async delete(authTokenCurrentUser: string, deleteCompanyData: DeleteCompanyDto) {
        const ownerFromBd: User = await this.tookUserFromBd(authTokenCurrentUser);
        const findedCompany:Company = ownerFromBd.company.find((company: Company):boolean => company.name === deleteCompanyData.name);
        if (!findedCompany) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);
        console.log('DELETE-',findedCompany);

        const removedCompany: Company = await this.companyRepository.remove(findedCompany);
        console.log('removedCompany-',findedCompany);
        const result: IResponseCompany = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": removedCompany,
            },
            "result": "working"
        }

        this.logger.log(`Deleted company -'${findedCompany.name}'=)`);
        return result;
    }

    private async tookUserFromBd(token):Promise<User> {
        const userFromToken = this.jwtService.decode(token.slice(7));
        if (!userFromToken['email']) throw new UnauthorizedException({message: "Incorrect credentials for updateUserInfo"});
        return this.userService.getUserByEmailWithCompany(userFromToken['email']);;
    }

}
