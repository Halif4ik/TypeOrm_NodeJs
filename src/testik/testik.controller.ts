import { Controller, Get } from '@nestjs/common';
import { TestikService } from './testik.service';
import {Testik} from "./entities/testik.entity";

@Controller('/')
export class TestikController {
  constructor(private readonly testikService: TestikService) {}

  @Get()
  findAll():Testik {
    return this.testikService.findAll();
  }



}
