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

@Injectable()
export class RequestsService {
    private readonly logger: Logger = new Logger(RequestsService.name);

    constructor(@InjectRepository(Request) private requestRepository: Repository<Request>,
                private companyService: CompanyService, private userService: UserService) {
    }

    async create(userFromGuard: User, createRequestDto: CreateRequestDto): Promise<GeneralResponse<IRequests>> {
        const foundCompany: Company | undefined = await this.companyService.getCompanyById(createRequestDto.companyId);
        if (!foundCompany) throw new HttpException("Company didnt create", HttpStatus.NOT_FOUND);
        if (foundCompany.owner.id === userFromGuard.id) throw new HttpException("You cant send request to your company", HttpStatus.BAD_REQUEST);

        const requestFromBd: Request | undefined = await this.requestRepository.findOne({
            where: {
                requestUser: {id: userFromGuard.id},
                targetCompany: {id: foundCompany.id},
            },
        });
        if (requestFromBd) throw new HttpException("You already send request to this company", HttpStatus.BAD_REQUEST);

        const newRequest: Request = this.requestRepository.create({
            targetCompany: foundCompany,
            requestUser: userFromGuard,
        });
        await this.requestRepository.save(newRequest);

        await this.userService.addRelationToUser(newRequest, userFromGuard);
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

    async acceptJoinRequest(owner: User, acceptRequestDto: CancelRequestDto): Promise<GeneralResponse<IRequests>> {
        const request: Request | undefined = await this.requestRepository.findOne({
            where: {
                id: acceptRequestDto.requestId,
                targetCompany: {
                    owner: owner,
                },
            },
            relations: ['targetCompany', 'requestUser'],
        });

        if (!request)
            throw new HttpException('Join request not found for this owner', HttpStatus.NOT_FOUND);

        let requestChanged: Request = await this.requestRepository.save({
            ...request,
            accept: true,
        });
        this.userService.addRelationToUser(request.targetCompany, request.requestUser);
        this.companyService.addRelationToCompany(request.requestUser,request.targetCompany);

        this.logger.log(`Owner- ${owner.email} accepted join request- ${request.id}`);
        return {
            status_code: HttpStatus.OK,
            detail: {
                request: {...requestChanged, targetCompany: null, requestUser: null},
            },
            result: 'accepted',
        } as GeneralResponse<IRequests>;
    }

    async declineJoinRequest(owner: User, declineRequestDto: CancelRequestDto,): Promise<GeneralResponse<IRequests>> {
        const request: Request | undefined = await this.requestRepository.findOne({
            where: {
                id: declineRequestDto.requestId,
                targetCompany: {
                    owner: owner,
                },
            },
        });
        if (request && request.accept) throw new HttpException(`You can't decline accepted request`, HttpStatus.BAD_REQUEST);
        else if (!request) {
            throw new HttpException(
                'Join request not found for this owner',
                HttpStatus.NOT_FOUND,
            );
        }
        let requestChanged: Request = await this.requestRepository.save({
            ...request,
            accept: false,
        });

        this.logger.log(`Owner- ${owner.email} declined join request- ${request.id}`);

        return {
            status_code: HttpStatus.OK,
            detail: {
                request: {...requestChanged, targetCompany: null, requestUser: null},
            },
            result: 'declined',
        } as GeneralResponse<IRequests>;
    }


}
