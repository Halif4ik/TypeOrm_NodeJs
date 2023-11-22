import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateRequestDto} from './dto/create-request.dto';
import {User} from "../user/entities/user.entity";
import {Company} from "../company/entities/company.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Request} from "./entities/reqest.entity";
import {CompanyService} from "../company/company.service";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, IRequests} from "../GeneralResponse/interface/customResponces";
import {CancelRequestDto} from "./dto/cancel-request.dto";
import {UserService} from "../user/user.service";
import {Invite} from "../invite/entities/invite.entity";

@Injectable()
export class RequestsService {
    private readonly logger: Logger = new Logger(RequestsService.name);

    constructor(@InjectRepository(Request) private requestRepository: Repository<Request>,
                private companyService: CompanyService, private userService: UserService) {
    }

    async create(userFromGuard: User, createRequestDto: CreateRequestDto): Promise<GeneralResponse<IRequests>> {
        const foundCompany: Company | undefined = await this.companyService.getCompanyById(createRequestDto.companyId);
        if (!foundCompany) throw new HttpException("Company didnt create", HttpStatus.NOT_FOUND);
        const newRequest: Request = this.requestRepository.create({
            targetCompany: foundCompany,
            requestUser: userFromGuard,
        });
        await this.requestRepository.save(newRequest);
        this.logger.log(`Created new Request from user- ${userFromGuard.email} to company- ${foundCompany.name}`);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "request": {...newRequest, requestUser: null, targetCompany: null},
            },
            "result": "created"
        } as GeneralResponse<IRequests>;
    }

    async cancelJoinRequest(user: User, cancelRequestDto: CancelRequestDto): Promise<GeneralResponse<IDeleted>> {
        const request: Request | undefined = await this.requestRepository.findOne({
            where: {
                id: cancelRequestDto.requestId,
                requestUser: {id: user.id},
            },
        });

        if (!request) {
            throw new HttpException(
                'Join request not found for the user',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.requestRepository.softDelete(request.id);
        this.logger.log(`User- ${user.email} canceled join request- ${request.id}`);
        return {
            status_code: HttpStatus.OK,
            detail: {
                request: null,
            },
            result: 'deleted',
        } as GeneralResponse<IDeleted>;
    }

    async acceptJoinRequest(owner: User, cancelRequestDto: CancelRequestDto): Promise<GeneralResponse<IRequests>> {
        const request: Request | undefined = await this.requestRepository.findOne({
            where: {
                id: cancelRequestDto.requestId,
                targetCompany: {
                    owner: owner,
                },
            },
            relations: ['targetCompany', 'requestUser'],
        });
        console.log('request-', request);

        if (!request) {
            throw new HttpException(
                'Join request not found for the owner',
                HttpStatus.NOT_FOUND,
            );
        }
        let requestChanged: Request = await this.requestRepository.save({
            ...request,
            accept: true,
        });
        this.userService.addRelationMemberToCompany(request.targetCompany, request.requestUser);

        this.logger.log(`Owner- ${owner.email} accepted join request- ${request.id}`);
        return {
            status_code: HttpStatus.OK,
            detail: {
                request: {...requestChanged, targetCompany: null, requestUser: null},
            },
            result: 'accepted',
        } as GeneralResponse<IRequests>;
    }

}
