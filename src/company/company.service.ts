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
import {DeleteUserDto} from "./dto/delete-user-company.dto";
import {Auth} from "../auth/entities/auth.entity";
import {Request} from "../reqests/entities/reqest.entity";
import {RemoveMembershipDto} from "./dto/remove-membership-company.dto";
import {use} from "passport";

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(Company) private companyRepository: Repository<Company>,
                private userService: UserService) {
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

    async getCompanyById(companyId: number): Promise<Company | undefined> {
        return this.companyRepository.findOne({where: {id: companyId}});
    }

    async removeUserFromCompany(ownerFromGuard: User, deleteUserDto: DeleteUserDto,): Promise<GeneralResponse<IDeleted>> {
        let findedCompany: Company = ownerFromGuard.company.find((company: Company): boolean => company.id === deleteUserDto.companyId);
        if (!findedCompany) throw new HttpException("Incorrect company name for this owner", HttpStatus.NOT_FOUND);

        const targetCompany: Company | undefined = await this.companyRepository.findOne({
            where: {
                id: deleteUserDto.companyId
            },
            relations: ['members']
        });
        if (!targetCompany) throw new HttpException('Error removeUserFromCompany', HttpStatus.NOT_FOUND,);


        // Find the user to be removed
        const willDeleteUserCompRelation: User | undefined = await this.userService.getUserByIdWithCompany(deleteUserDto.userId);
        if (!willDeleteUserCompRelation)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        await this.removeRelationUserCompany(willDeleteUserCompRelation, targetCompany, deleteUserDto.userId);
        return {
            status_code: HttpStatus.OK,
            detail: {
                removedUser: null,
            },
            result: 'removed',
        };
    }

// Remove the user from the company
    async removeRelationUserCompany(userToRemove: User, targetCompany: Company, userId: number): Promise<void> {
        const willDeleteUserNotRelation: User | undefined = targetCompany.members.find((user: User): boolean => user.id === userId);
        if (!willDeleteUserNotRelation) throw new HttpException("Incorrect user id for this company", HttpStatus.NOT_FOUND);
        targetCompany.members = targetCompany.members.filter((user: User): boolean => user.id !== userToRemove.id);
         await this.companyRepository.save(targetCompany);
        this.logger.log(`Remove relation ${userToRemove.email} for/from Company - ${targetCompany.name}`);
    }

    async addRelationToCompany<T>(newRelation: T, targetCompany: Company): Promise<Company> {
        const targetCompany2: Company = await this.companyRepository.findOne({
            where: {id: targetCompany.id},
            relations: ['members']
        });
        let logMessage: string = '';
        if (newRelation instanceof User) {
            logMessage = 'User';
            targetCompany2.members.push(newRelation);
        }

        const temp: Company = await this.companyRepository.save(targetCompany2);
        this.logger.log(`Added relation ${logMessage} for Company - ${Company.name}`);
        return temp;
    }

    async removeMembership(user: User, removeMembershipDto: RemoveMembershipDto): Promise<GeneralResponse<IDeleted>> {
        const targetCompany: Company | undefined = await this.companyRepository.findOne({
            where: {
                id: removeMembershipDto.companyId,
            },
            relations: ['members']
        });
        if (!targetCompany) throw new HttpException('This company absent', HttpStatus.NOT_FOUND,);

        await this.removeRelationUserCompany(user, targetCompany,user.id);
        return {
            status_code: HttpStatus.OK,
            detail: {
                removedUser: null,
            },
            result: 'removed',
        };
    }
}
