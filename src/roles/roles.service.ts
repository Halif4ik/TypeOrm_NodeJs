import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {AssignRoleDto} from "./dto/assign-role.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CompanyService} from "../company/company.service";
import {UserService} from "../user/user.service";
import {Role} from "./entities/role.entity";
import {User} from "../user/entities/user.entity";
import {Company} from "../company/entities/company.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IRole} from "../GeneralResponse/interface/customResponces";

@Injectable()
export class RolesService {
    private readonly logger: Logger = new Logger(RolesService.name);

    constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>,
                private companyService: CompanyService, private userService: UserService) {
    }

    async assignAdmin(owner: User, assignRoleDto: AssignRoleDto): Promise<GeneralResponse<IRole>> {
        const targetCompany: Company = await this.companyService.getCompanyByIdAnDOwner(assignRoleDto.companyId,
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
            value: "Admin",
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
                    company: {...newRole.company, owner: null},
                    user: {...newRole.user}
                },
            },
            "result": "created"
        };
    }

}
