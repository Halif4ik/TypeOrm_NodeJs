import {HttpStatus, Injectable} from '@nestjs/common';
import { CreateWorkFlowDto } from './dto/create-work-flow.dto';
import { UpdateWorkFlowDto } from './dto/update-work-flow.dto';
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TQuiz} from "../GeneralResponse/interface/customResponces";

@Injectable()
export class WorkFlowService {
  async create(userFromGuard: User,createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<any>> {

    return {
      "status_code": HttpStatus.OK,
      "detail": {
        "quiz": {},
      },
      "result": "created"
    };
  }


}
