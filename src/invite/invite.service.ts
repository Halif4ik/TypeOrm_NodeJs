import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateOrDelInviteDto} from './dto/create-or-del-invite.dto';
import {UpdateInviteDto} from './dto/update-invite.dto';
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Company} from "../company/entities/company.entity";
import {Repository} from "typeorm";
import {Invite} from "./entities/invite.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, IInvite} from "../GeneralResponse/interface/customResponces";

@Injectable()
export class InviteService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(Invite) private inviteRepository: Repository<Invite>,
                private userService: UserService,) {
    }

    async create(userFromGuard: User, createInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<IInvite>> {
        let foundCompany: Company = userFromGuard.company.find((company: Company): boolean => company.id === createInviteDto.companyId);
        if (!foundCompany) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);

        //cheking user for invite from this company
        let foundTargetUser: User = await this.userService.getUserByEmailWCompTargInvit(createInviteDto.membersEmail);
        const isPresentInvitesForTargetUser: Invite[] = await this.inviteRepository.find({
            where: {
                targetUser: {id: foundTargetUser.id}
            },
            relations: ["ownerCompany", "targetUser"]
        });
        if (isPresentInvitesForTargetUser) {
            const isTargetUserHasThisInvite: boolean = isPresentInvitesForTargetUser.some((oneInvite: Invite): boolean =>
                oneInvite.ownerCompany.id === foundCompany.id);
            if (isTargetUserHasThisInvite) throw new HttpException("Target used already has been received invite", HttpStatus.BAD_REQUEST);
        }


        const newInvite: Invite = this.inviteRepository.create({
            accept: createInviteDto.accept,
            ownerCompany: foundCompany,
            ownerUser: userFromGuard,
            targetUser: foundTargetUser,
        });

        let inviteResponsce: Invite = await this.inviteRepository.save(newInvite);
        this.logger.log(`Created new Invite for user- ${foundTargetUser.email} from company- ${foundCompany.name}`);
        inviteResponsce = {
            ...inviteResponsce, ownerCompany: {...inviteResponsce.ownerCompany, owner: null},
            ownerUser: {...inviteResponsce.ownerUser, company: null, password: null, isActive: null, deleteAt: null},
            targetUser: {
                ...inviteResponsce.targetUser,
                firstName: null,
                password: null,
                isActive: null,
                deleteAt: null,
                auth: null
            }
        }
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "invite": inviteResponsce,
            },
            "result": "created"
        } as GeneralResponse<IInvite>;
    }

    async deleteInvite(userFromGuard: User, createInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<IDeleted>> {

        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "invite": null,
            },
            "result": "deleted"
        };

    }
}
