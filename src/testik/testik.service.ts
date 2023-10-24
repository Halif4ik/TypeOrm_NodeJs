import {HttpStatus, Injectable} from '@nestjs/common';
import {Testik} from "./interface/testik.interface";

@Injectable()
export class TestikService {
    /*create(createTestikDto: CreateTestikDto) {
      return 'This action adds a new testik';
    }*/
    async findAll(): Promise<Testik> {
        return {
            "status_code": HttpStatus.OK,
            "detail": "ok",
            "result": "working"
        };
    }

}
