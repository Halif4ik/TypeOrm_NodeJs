import {Auth} from "../../auth/entities/auth.entity";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";

export interface IRespAuth {
    "auth": Auth
}

export interface IUserInfo {
    "user": User
}

export interface ICompany {
    "company": Company | Company[]
}

export interface IDeleted {
    "company"?: null
    "user"?: null
    "auth"?: null
}