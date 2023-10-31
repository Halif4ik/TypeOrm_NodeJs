import {Testik} from "../../testik/interface/testik.interface";
import {User} from "./user.entity";
export interface IResponse extends Testik {
    status_code: number;
    detail: {
        "user": User
    };
    result: string;
}
