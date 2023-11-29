import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Query
} from '@nestjs/common';
import {RequestsService} from './requests.service';
import {CreateRequestDto} from './dto/create-request.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, IRequests} from "../GeneralResponse/interface/customResponces";
import {CancelRequestDto} from "./dto/cancel-request.dto";
import {DeleteCompanyDto} from "../company/dto/delete-company.dto";


@Controller('requests')
export class ReqestsController {
    constructor(private readonly requestsService: RequestsService) {
    }

    // 5. User create one join requests
    //Endpoint: POST /create
    // Permissions: Authenticated user
    @Post('/create')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    createInvite(@UserDec() userFromGuard: User, @Body() createRequestDto: CreateRequestDto): Promise<GeneralResponse<IRequests>> {
        return this.requestsService.create(userFromGuard, createRequestDto);
    }

    // 6. User cancels a join request
    // Endpoint: DELETE /requests/cancelRequest
    // Permissions: Authenticated user
    @Delete('/cancelRequest')
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    cancelJoinRequest(@UserDec() user: User, @Body() cancelRequestDto: CancelRequestDto): Promise<GeneralResponse<IDeleted>> {
        return this.requestsService.cancelJoinRequest(user, cancelRequestDto);
    }

    // 7. Owner accepts a join request
    // Endpoint: POST /requests/accept
    // Permissions: Only company owner
    @Post('/accept')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    acceptJoinRequest(@UserDec() owner: User, @Body() cancelRequestDto: CancelRequestDto): Promise<GeneralResponse<IRequests>> {
        return this.requestsService.acceptJoinRequest(owner, cancelRequestDto);
    }

    // 8. Owner declines a join request
    // Endpoint: POST /requests/decline
    // Permissions: Only company owner
    @Post('/decline')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    declineJoinRequest(@UserDec() owner: User, @Body() cancelRequestDto: CancelRequestDto,
    ): Promise<GeneralResponse<IRequests>> {
        return this.requestsService.declineJoinRequest(owner, cancelRequestDto);
    }

    // 11. List user's requests in companies
    // Endpoint: GET /requests/my
    // Permissions: Authenticated user
    @Get('/my')
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    listMyRequests(@UserDec() userFromGuard: User,):Promise<GeneralResponse<IRequests>>{
        return this.requestsService.listUserRequests(userFromGuard);
    }
    // 14. List requests in my company
    // Endpoint: GET /requests/toMyCompany
    // Permissions: Authenticated user
    @Get('/toMyCompany')
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @UseGuards(AuthGuard(['auth0', 'jwt-auth']))
    listRequestToMyCompany(@UserDec() userFromGuard: User, @Query() idCompanyDto: DeleteCompanyDto):Promise<GeneralResponse<IRequests>>{
        return this.requestsService.listRequestToMyCompany(userFromGuard,idCompanyDto);
    }


}
