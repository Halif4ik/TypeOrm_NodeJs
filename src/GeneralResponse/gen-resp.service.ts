import {HttpStatus, Injectable} from '@nestjs/common';
import {GeneralResponse} from "./interface/generalResponse.interface";

@Injectable()
export class GenRespService {
    async findAll(): Promise<GeneralResponse<string>> {
        return {
            "status_code": HttpStatus.OK,
            "detail": "ok",
            "result": "working"
        };
    }

}
