import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {RequestsService} from './requests.service';
import {CreateRequestDto} from './dto/create-request.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IDeleted, IRequests} from "../GeneralResponse/interface/customResponces";
import {CancelRequestDto} from "./dto/cancel-request.dto";


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

}
