import {Module} from '@nestjs/common';
import {NotificService} from './notific.service';
import {NotificController} from './notific.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {Notific} from "./entities/notific.entity";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [NotificController],
  providers: [NotificService],
  imports: [
    UserModule,
    ConfigModule,
    TypeOrmModule.forFeature([Notific]),
    JwtModule,
    PassportModule,
  ],
  exports: [NotificService]
})
export class NotificModule {}
