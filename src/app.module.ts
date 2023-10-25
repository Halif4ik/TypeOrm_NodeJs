import {TestikController} from "./testik/testik.controller";
import {Module} from "@nestjs/common";
import {TestikService} from "./testik/testik.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import {User} from "./user/entities/user.entity";
@Module({
  controllers: [TestikController],
  providers: [TestikService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    /*TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_DOCKER_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_ROOT_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User],
      synchronize: true,//only for course
      autoLoadEntities: true,
    }), */
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'gremlin2',
      database: 'chat_spa_loc2',
      entities: [User],
      synchronize: true,//only for course
      autoLoadEntities: true,
    }),
    UserModule,
  ],
})
export class AppModule {}