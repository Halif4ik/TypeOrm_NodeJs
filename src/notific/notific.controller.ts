import {Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import {NotificService} from './notific.service';
import {PaginationsDto} from "../user/dto/pagination-user.dto";
import {Notific} from "./entities/notific.entity";

@Controller('notific')
export class NotificController {
   constructor(private readonly notificService: NotificService) {
   }

   //1. Get notifications by user
   //Endpoint: Get /notific/:userId
   //Permissions: Only Authenticated User
   @Get(':userId')
   async getNotificationsByUser(@Param('userId', ParseIntPipe) userId: number,
                                @Query() paginationsDto: PaginationsDto): Promise<Notific[]> {
      return this.notificService.getNotificationsByUser(userId, paginationsDto.page,
          paginationsDto.revert);
   }


}
