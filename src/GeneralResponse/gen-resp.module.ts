import {Module} from '@nestjs/common';
import {GenRespService} from './gen-resp.service';
import {GenRespController} from './gen-resp.controller';

@Module({
    controllers: [GenRespController],
    providers: [GenRespService],
})
export class GenRespModule {
}
