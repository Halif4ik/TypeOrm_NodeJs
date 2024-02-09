import {Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {NotificService} from './notific.service';
import {PaginationsDto} from "../user/dto/pagination-user.dto";
import {Notific} from "./entities/notific.entity";
import {AuthGuard} from "@nestjs/passport";
import {JwtRoleMemberGuardCompIdBody} from "../auth/jwt-Role-MemberQuiz.guard";

@Controller('notific')
export class NotificController {
   constructor(private readonly notificService: NotificService) {
   }

   //1. Get notifications by user
   //Endpoint: Get /notific/:userId
   //Permissions: Only Authenticated User
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleMemberGuardCompIdBody)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   @Get(':userId')
   async getNotificationsByUser(@Param('userId', ParseIntPipe) userId: number,
                                @Query() paginationsDto: PaginationsDto): Promise<Notific[]> {
      return this.notificService.getNotificationsByUser(userId, paginationsDto.page,
          paginationsDto.revert);
   }

   //2. Mark notification as read
   //Endpoint: Patch /notific/mark-as-read/:notificationId
   @Patch('mark-as-read/:notificationId')
   @UseGuards(AuthGuard(['auth0', 'jwt-auth']), JwtRoleMemberGuardCompIdBody)
   async markNotificationAsRead(@Param('notificationId', ParseIntPipe) notificationId: number,
   ): Promise<Notific> {
      return this.notificService.markNotificationAsRead(notificationId);
   }

}
