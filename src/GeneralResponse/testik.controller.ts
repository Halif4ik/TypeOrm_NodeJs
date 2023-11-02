import {Controller, Get} from '@nestjs/common';
import {TestikService} from './testik.service';
import {Testik} from "./interface/generalResponse.interface";

@Controller('/')
export class TestikController {
    constructor(private readonly testikService: TestikService) {
    }

    @Get()
    async findAll(): Promise<Testik> {
        return await this.testikService.findAll();
    }


}
