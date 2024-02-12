import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {AuthService} from '../auth/auth.service';
import {User} from "../user/entities/user.entity";

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
   constructor(private authService: AuthService) {
   }

   @WebSocketServer() server: Server;
   async handleConnection(client: Socket): Promise<void> {
      try {
         const user: User = await this.authService.validateUserByToken(client.request.headers.authorization);
         await client.join(user.id.toString());
      } catch (error: Error | any) {
         client.emit('error', 'unauthorized');
         client.disconnect();
      }
   }

   async handleDisconnect(client: Socket): Promise<void> {
      await client.leave(client.nsp.name);
   }

   async sendNotificationToUser(userId: number, message: string): Promise<void> {
      this.server.to(`${userId}`).emit('notification', message);
   }
}
