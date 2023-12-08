import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {AssignRoleDto} from "./dto/assign-role.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CompanyService} from "../company/company.service";
import {UserService} from "../user/user.service";
import {Role, UserRole} from "./entities/role.entity";
import {User} from "../user/entities/user.entity";
import {Company} from "../company/entities/company.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TCompanyForResponse, TRole, TRoleForResponse} from "../GeneralResponse/interface/customResponces";

@Injectable()
export class RolesService {
    private readonly logger: Logger = new Logger(RolesService.name);

    constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>,
                private companyService: CompanyService, private userService: UserService) {
    }

    async assignAdmin(owner: User, assignRoleDto: AssignRoleDto): Promise<GeneralResponse<TRole>> {
        const targetCompany: Company = await this.companyService.getCompanyByIdAndOwner(assignRoleDto.companyId,
            assignRoleDto.userId, owner);
        if (!targetCompany) throw new HttpException("Our company does not have this user", HttpStatus.NOT_FOUND);
        const isTargetUserAdmin: Role = await this.rolesRepository.findOne({
            where: {
                company: {id: targetCompany.id},
                user: {id: assignRoleDto.userId},
            },
        });
        if (isTargetUserAdmin)
            throw new HttpException("This user already has assign Admin", HttpStatus.BAD_REQUEST);

        const newRole: Role = this.rolesRepository.create({
            value: UserRole.ADMIN,
            company: targetCompany,
            user: targetCompany.members[0],
        });
        await this.rolesRepository.save(newRole);

        this.logger.log(`Created new role- ${newRole.value} for user- ${targetCompany.members[0].email} in company- ${targetCompany.name}`);

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "role": {
                    ...newRole,
                    company: {
                        id: newRole.company.id,
                        name: newRole.company.name,
                        description: newRole.company.description,
                    },
                    user: {
                        id: newRole.user.id,
                        firstName: newRole.user.firstName,
                        email: newRole.user.email,
                        isActive: null,
                    }
                },
            },
            "result": "created"
        };
    }

    async removeAdmin(owner: User, assignRoleDto: AssignRoleDto): Promise<GeneralResponse<TRole>> {
        const targetCompany: Company = await this.companyService.getCompanyByIdAndOwner(assignRoleDto.companyId,
            assignRoleDto.userId, owner);
        if (!targetCompany)
            throw new HttpException("Our company does not have this user", HttpStatus.NOT_FOUND);

        const adminRole: Role = await this.rolesRepository.findOne({
            where: {
                company: {id: targetCompany.id},
                user: {id: assignRoleDto.userId},
                value: UserRole.ADMIN,
            },

        });

        if (!adminRole)
            throw new HttpException("This user does not have the Admin role", HttpStatus.BAD_REQUEST);

        await this.rolesRepository.remove(adminRole);

        this.logger.log(`Removed Admin role for user-${assignRoleDto.userId} in company-${targetCompany.name}`);

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "role": {
                    ...adminRole,
                    company: {
                        id: adminRole.company.id,
                        name: adminRole.company.name,
                        description: adminRole.company.description,
                    },
                    user: {...adminRole.user},
                },
            },
            "result": "removed",
        };

    }

    async showAllAdmins(owner: User, companyId: number): Promise<GeneralResponse<TRole>> {
        const targetCompany: Company = await this.companyService.getCompanyByIdOnlyOwner(companyId,
            owner);
        if (!targetCompany)
            throw new HttpException("Our company does not have this user", HttpStatus.NOT_FOUND);

        const adminRoles: Role[] = await this.rolesRepository.find({
            where: {
                company: {id: companyId},
                value: UserRole.ADMIN,
            },
            relations: ["user"],
        });
        if (!adminRoles.length)
            throw new HttpException("This company does not have Admins", HttpStatus.NOT_FOUND);

        const cuttedAdminRoles: TRoleForResponse[] = adminRoles.map((role: Role) => {
            return {
                id: role.id,
                value: role.value,
                user: {
                    id: role.user.id,
                    firstName: role.user.firstName,
                    email: role.user.email,
                    isActive: null,
                }
            } ;
        });

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "role": cuttedAdminRoles,
            },
            "result": "showed",
        };
    }
}
