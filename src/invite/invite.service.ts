import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateInviteDto} from './dto/create-invite.dto';
import {UpdateInviteDto} from './dto/update-invite.dto';
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Company} from "../company/entities/company.entity";
import {Repository} from "typeorm";
import {Invite} from "./entities/invite.entity";
import {IResponseCompanyOrUser} from "../company/entities/responce-company.interface";

@Injectable()
export class InviteService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(Invite) private inviteRepository: Repository<Invite>,
                private userService: UserService,) {
    }

    async create(userFromGuard: User, createInviteDto: CreateInviteDto): Promise<IResponseCompanyOrUser> {
        let findedCompany: Company = userFromGuard.company.find((company: Company): boolean => company.id === createInviteDto.companyId);
        if (!findedCompany) throw new HttpException("Incorrect company name for this user", HttpStatus.NOT_FOUND);

        //cheking user for invite
        let findedTargetUser: User = await this.userService.getUserByEmail(createInviteDto.membersEmail);
        if (!findedTargetUser) throw new HttpException("Did not find target user for invite", HttpStatus.NOT_FOUND);
        console.log('findedTargetUser-', findedTargetUser);

        const newInvite:Invite = this.inviteRepository.create({
            accept: createInviteDto.accept,
            ownerCompany: findedCompany,
            ownerUser: userFromGuard,
            targetUser: findedTargetUser,
        });
        this.logger.log(`Created new Invite for user- ${findedTargetUser.email} from company- ${findedCompany.name}`);
        let inviteResponsce:Invite = await this.inviteRepository.save(newInvite);
        console.log('inviteResponsce-', inviteResponsce);
        inviteResponsce = {
            ...inviteResponsce, ownerCompany: {...inviteResponsce.ownerCompany, owner: null},
            ownerUser: {...inviteResponsce.ownerUser, company: null}
        }
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "invite": inviteResponsce,
            },
            "result": "created"
        };
    }

    findAll() {
        return `This action returns all invite`;
    }

    findOne(id: number) {
        return `This action returns a #${id} invite`;
    }

    update(id: number, updateInviteDto: UpdateInviteDto) {
        return `This action updates a #${id} invite`;
    }

    remove(id: number) {
        return `This action removes a #${id} invite`;
    }
}
