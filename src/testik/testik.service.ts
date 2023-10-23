import { Injectable } from '@nestjs/common';
import {Testik} from "./entities/testik.entity";

@Injectable()
export class TestikService {
  /*create(createTestikDto: CreateTestikDto) {
    return 'This action adds a new testik';
  }*/

  findAll():Testik {
    return {
      "status_code": 200,
      "detail": "ok",
      "result": "working"
    };
  }

}
