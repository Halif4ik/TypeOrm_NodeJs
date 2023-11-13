import {GeneralResponse} from "../../GeneralResponse/interface/generalResponse.interface";
import {Auth} from "../../auth/entities/auth.entity";
export interface IResponseAuth extends GeneralResponse {
    status_code: number;
    detail: {
        "auth": Auth
    };
    result: string;
}
