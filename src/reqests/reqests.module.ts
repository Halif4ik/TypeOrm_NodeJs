import { Module } from '@nestjs/common';
import { ReqestsService } from './reqests.service';
import { ReqestsController } from './reqests.controller';

@Module({
  controllers: [ReqestsController],
  providers: [ReqestsService],
})
export class ReqestsModule {}
