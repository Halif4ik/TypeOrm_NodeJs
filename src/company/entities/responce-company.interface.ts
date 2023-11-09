import {GeneralResponse} from "../../GeneralResponse/interface/generalResponse.interface";
import {Company} from "./company.entity";
export interface IResponseCompany extends GeneralResponse {
    status_code: number;
    detail: {
        "user": Company
    };
    result: string;
}
