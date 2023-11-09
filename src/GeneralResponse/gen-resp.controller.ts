import {Controller, Get} from '@nestjs/common';
import {GenRespService} from './gen-resp.service';
import {GeneralResponse} from "./interface/generalResponse.interface";

@Controller('/')

export class GenRespController {
    constructor(private readonly testikService: GenRespService) {
    }

    @Get()
    async findAll(): Promise<GeneralResponse> {
        return this.testikService.findAll();
    }


}
