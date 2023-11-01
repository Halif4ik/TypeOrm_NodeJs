import {HttpStatus, Injectable} from '@nestjs/common';
import {Testik} from "./interface/generalResponse.interface";

@Injectable()
export class TestikService {
    async findAll(): Promise<Testik> {
        return {
            "status_code": HttpStatus.OK,
            "detail": "ok",
            "result": "working"
        };
    }

}
