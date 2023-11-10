import {HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Company} from "./entities/company.entity";
import {IResponseCompany} from "./entities/responce-company.interface";
import {User} from "../user/entities/user.entity";

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private jwtService: JwtService, private userService: UserService,
                @InjectRepository(Company) private companyRepository: Repository<Company>) {
    }

    /*update if exist or create company */
    async create(token: string, companyData: CreateCompanyDto): Promise<IResponseCompany> {
        const userFromToken = this.jwtService.decode(token.slice(7));
        if (!userFromToken['email']) throw new UnauthorizedException({message: "Incorrect credentials for updateUserInfo"});
        const fetureOwnerFromBd: User = await this.userService.getUserByEmail(userFromToken['email']);
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



    findAll() {
        return `This action returns all company`;
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    update(id: number, updateCompanyDto: UpdateCompanyDto) {
        return `This action updates a #${id} company`;
    }

    remove(id: number) {
        return `This action removes a #${id} company`;
    }
}