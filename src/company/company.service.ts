import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Company} from "./entities/company.entity";
import {User} from "../user/entities/user.entity";
import {DeleteCompanyDto} from "./dto/delete-company.dto";
import * as process from "process";
import {IAllMembers, ICompany, IDeleted} from "../GeneralResponse/interface/customResponces";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {DeleteUserDto} from "./dto/delete-user-company.dto";
import {RemoveMembershipDto} from "./dto/remove-membership-company.dto";

@Injectable()
export class CompanyService {
    private readonly logger: Logger = new Logger(CompanyService.name);

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

    async getCompanyById(companyId: number): Promise<Company | undefined> {
        return this.companyRepository.findOne({where: {id: companyId}});
    }

    async getCompanyByIdAnDOwner(companyId: number, targetUserId: number, owner: User): Promise<Company | undefined> {
        return this.companyRepository.findOne({
            where: {
                id: companyId,
                owner: owner,
                members:{ id: targetUserId}
            },
            relations: ['members', 'roles'],
        });
    }

    async removeUserFromCompany(ownerFromGuard: User, deleteUserDto: DeleteUserDto,): Promise<GeneralResponse<IDeleted>> {
        const targetCompany: Company | undefined = await this.companyRepository.findOne({
            where: {
                id: deleteUserDto.companyId,
                owner: ownerFromGuard,
            },
            relations: ['members']
        });
        if (!targetCompany) throw new HttpException('Incorrect company name for this owner', HttpStatus.NOT_FOUND,);


        await this.removeRelationUserCompany(targetCompany, deleteUserDto.userId);
        return {
            status_code: HttpStatus.OK,
            detail: {
                removedUser: null,
            },
            result: 'removed',
        };
    }

    // Remove the user from the company
    private async removeRelationUserCompany(targetCompany: Company, userId: number): Promise<void> {
        const willDeleteUserNotRelation: User | undefined = targetCompany.members.find((user: User): boolean => user.id === userId);
        if (!willDeleteUserNotRelation) throw new HttpException("Incorrect user id for this company", HttpStatus.NOT_FOUND);

        // Create a query builder
        const queryBuilder: SelectQueryBuilder<Company> = this.companyRepository.createQueryBuilder();
        // Update the members collection
        await queryBuilder
            .relation(Company, "members")
            .of(targetCompany)
            .remove(willDeleteUserNotRelation);

        this.logger.log(`Remove relation ${willDeleteUserNotRelation.email} for/from Company - ${targetCompany.name}`);
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

        await this.removeRelationUserCompany(targetCompany, user.id);
        return {
            status_code: HttpStatus.OK,
            detail: {
                removedUser: null,
            },
            result: 'removed',
        };
    }

    async listAllMembersOfCompany(idCompanyDto: DeleteCompanyDto): Promise<GeneralResponse<IAllMembers>> {
        const companyWithMembers: Company = await this.companyRepository.findOne({
            where: {
                id: idCompanyDto.id,
            },
            relations: ['members'],
        });


        return {
            status_code: HttpStatus.OK,
            detail: {
                members: companyWithMembers.members,
            },
            result: 'retrieved',
        };
    }
}
