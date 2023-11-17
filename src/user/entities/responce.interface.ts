import {GeneralResponse} from "../../GeneralResponse/interface/generalResponse.interface";
import {User} from "./user.entity";
export interface IResponseUser extends GeneralResponse {
    status_code: number;
    detail: {
        "user": User
    };
    result: string;
}
