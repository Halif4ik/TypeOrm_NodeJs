import {GeneralResponse} from "../../GeneralResponse/interface/generalResponse.interface";
import {User} from "./user.entity";
import {Auth} from "../../auth/entities/auth.entity";
export interface IResponseUser extends GeneralResponse {
    status_code: number;
    detail: {
        "user": User
    };
    result: string;
}
