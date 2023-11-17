import {GeneralResponse} from "../../GeneralResponse/interface/generalResponse.interface";
import {Company} from "./company.entity";
import {User} from "../../user/entities/user.entity";
export interface IResponseCompanyOrUser extends GeneralResponse {
    status_code: number;
    detail?: {
        "user"?: User
        "company"?: Company
    };
    result: string;
}
