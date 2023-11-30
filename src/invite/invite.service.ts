import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateOrDelInviteDto} from './dto/create-or-del-invite.dto';
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Company} from "../company/entities/company.entity";
import {Repository} from "typeorm";
import {Invite} from "./entities/invite.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, IInvite} from "../GeneralResponse/interface/customResponces";
import {AcceptInviteDto} from "./dto/update-invite.dto";
import {Request} from "../reqests/entities/reqest.entity";

@Injectable()
export class InviteService {
    private readonly logger: Logger = new Logger(InviteService.name);

    constructor(@InjectRepository(Invite) private inviteRepository: Repository<Invite>,
                private userService: UserService,) {
    }

    async create(userFromGuard: User, crOrDelInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<IInvite>> {
        let foundCompany: Company = userFromGuard.company.find((company: Company): boolean => company.id === crOrDelInviteDto.companyId);
        if (!foundCompany) throw new HttpException("Incorrect company ID for this user", HttpStatus.NOT_FOUND);

        //cheking user for invite from this company
        const foundTargetUser: User = await this.userService.getUserByIdWCompTargInvitRequsts(crOrDelInviteDto.userId);
        const isPresentInvitesForTargetUser: Invite[] = await this.inviteRepository.find({
            where: {
                targetUser: {id: foundTargetUser.id},
            },
            relations: ["ownerCompany", "targetUser"]
        });


        if (isPresentInvitesForTargetUser) {
            const isTargetUserHasThisInvite: boolean = isPresentInvitesForTargetUser.some((oneInvite: Invite): boolean =>
                oneInvite.ownerCompany.id === foundCompany.id);
            if (isTargetUserHasThisInvite) throw new HttpException("Target used already has been received invite", HttpStatus.BAD_REQUEST);
        }

        const newInvite: Invite = this.inviteRepository.create({
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
        } ;
    }

    async deleteInvite(userFromGuard: User, crOrDelInviteDto: CreateOrDelInviteDto): Promise<GeneralResponse<IDeleted>> {
        const foundCompanyFromDtoInCurrUser: Company = userFromGuard.company.find((company: Company): boolean => company.id === crOrDelInviteDto.companyId);
        if (!foundCompanyFromDtoInCurrUser) throw new HttpException("Incorrect company ID for this user", HttpStatus.NOT_FOUND);

        const foundTargetUser: User = await this.userService.getUserByIdWCompTargInvitRequsts(crOrDelInviteDto.userId);
        const isAnyInvitesInTargetUser: Invite[] = await this.inviteRepository.find({
            where: {
                targetUser: {id: foundTargetUser.id}
            },
            relations: ["ownerCompany", "targetUser"]
        });

        if (isAnyInvitesInTargetUser.length < 1) throw new HttpException("Target don't has ANY invites", HttpStatus.BAD_REQUEST);

        const targetUserHasThisInvite: Invite = isAnyInvitesInTargetUser.find((oneInvite: Invite): boolean =>
            oneInvite.ownerCompany.id === foundCompanyFromDtoInCurrUser.id);
        if (!targetUserHasThisInvite) throw new HttpException("Target don't has invite", HttpStatus.BAD_REQUEST);
        await this.inviteRepository.softDelete(targetUserHasThisInvite.id);

        this.logger.log(`Soft-deleted invite for target userId -'${crOrDelInviteDto.userId}' in company -'${foundCompanyFromDtoInCurrUser.name}'`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "invite": null,
            },
            "result": "deleted"
        };

    }

    async updateInvite(userFromGuardFetureMember: User, acceptInviteDto: AcceptInviteDto): Promise<GeneralResponse<IInvite>> {
        const foundInvite: Invite[] = await this.inviteRepository.find({
            where: {
                id: acceptInviteDto.inviteId
            },
            relations: ["targetUser", "ownerCompany"]
        });
        if (foundInvite.length < 1) throw new HttpException("Target invites dosent exist", HttpStatus.BAD_REQUEST);
        else if (foundInvite[0].targetUser.id !== userFromGuardFetureMember.id)
            throw new HttpException("This invite not for you", HttpStatus.BAD_REQUEST);

        this.userService.addRelationToUser(foundInvite[0].ownerCompany, userFromGuardFetureMember);
        /*we have only one invite by id from Request*/
        let inviteResponsce: Invite = await this.inviteRepository.save({
            ...foundInvite[0],
            accept: acceptInviteDto.accept
        });

        this.logger.log(`Invite for user- ${userFromGuardFetureMember.email} by №- ${acceptInviteDto.inviteId} changed to - ${acceptInviteDto.accept}`);
        inviteResponsce = {
            ...inviteResponsce, targetUser: {...inviteResponsce.targetUser, password: null}
        }
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "invite": inviteResponsce,
            },
            "result": "created"
        };
    }

    async listUserInvites(userFromGuard: User): Promise<GeneralResponse<IInvite>> {
        const ownerInvites: Invite[] = await this.inviteRepository.find({
            where: {
                ownerUser: {id: userFromGuard.id}
            },
            relations: ['ownerCompany'],
        });
        return {
            status_code: HttpStatus.OK,
            detail: {
                "invite": ownerInvites,
            },
            result: 'retrieved',
        };
    }
}
