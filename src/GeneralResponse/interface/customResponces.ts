import {Auth} from "../../auth/entities/auth.entity";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";
import {Invite} from "../../invite/entities/invite.entity";
import {Request} from "../../reqests/entities/reqest.entity";

export interface IRespAuth {
    "auth": Auth
}

export interface IUserInfo {
    "user": User
}
export interface IAllMembers {
    "members":  User[]
}

export interface ICompany {
    "company": Company | Company[]
}

export interface IInvite {
    "invite": Invite | Invite[]
}

export interface IRequests {
    "request": Request | Request[]
}

export interface IDeleted {
    "company"?: null
    "user"?: null
    "auth"?: null
    "invite"?: null
    "request"?: null
    "removedUser"?: null
}