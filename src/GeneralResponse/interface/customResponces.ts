import {Auth} from "../../auth/entities/auth.entity";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";
import {Invite} from "../../invite/entities/invite.entity";
import {Request} from "../../reqests/entities/reqest.entity";
import {Role} from "../../roles/entities/role.entity";
import {Quiz} from "../../quizz/entities/quizz.entity";

export interface IRespAuth {
    "auth": Auth
}

export interface IUserInfo {
    "user": User
}

export interface IAllMembers {
    "members": User[]
}

export interface ICompany {
    "company": Company | Company[]
}

export type TInvite = {
    "invite": TInviteForResponse | TInviteForResponse[]
}

export type TInviteForResponse = Omit<Invite, 'deleteAt' | 'ownerUser' | 'targetUser'> & {
    ownerUser: TUserForResponse;
    targetUser: TUserForResponse;
}

export type TUserForResponse =
    Omit<User, 'password' | 'deleteAt' | 'auth' | 'company' | 'invite' | 'targetForInvite' |
        'companyMember' | 'requests' | 'roles'>

interface InviteForResponse extends Omit<Invite, 'deleteAt' | 'ownerUser' | 'targetUser'> {
    ownerCompany: Company;
    ownerUser: User;
    targetUser: User;
    accept: boolean;
    deleteAt: Date;
    id: number;
    createAt: Date;
}
export interface IRequests {
    "request": Request | Request[]
}

export interface IRole {
    "role": Role | Role[]
}

export interface IQuiz {
    "quiz": Quiz | Quiz[]
}

export interface IDeleted {
    "company"?: null
    "user"?: null
    "auth"?: null
    "invite"?: null
    "request"?: null
    "removedUser"?: null
}