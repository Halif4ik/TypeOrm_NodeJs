import {Auth} from "../../auth/entities/auth.entity";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";
import {Invite} from "../../invite/entities/invite.entity";
import {Request} from "../../reqests/entities/reqest.entity";
import {Role} from "../../roles/entities/role.entity";
import {Quiz} from "../../quizz/entities/quizz.entity";
import {Question} from "../../quizz/entities/question.entity";
import {PassedQuiz} from "../../work-flow/entities/passedQuiz.entity";

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
        'companyMember' | 'requests' | 'roles' | 'passedQuiz'>

export type TCompanyForResponse = Omit<Company, 'deleteAt' | 'owner' | 'members' | 'invites' |
    'quiz' | 'roles' | 'requests'>

export type TPassedQuizForResponce = Omit<PassedQuiz, 'user' | 'targetQuiz' | 'rightAnswers'> & {
    user?: TUserForResponse;
    targetQuiz?: TQuizForResponse;
}
export type TPassedQuiz = {
    "quiz": TPassedQuizForResponce
}
export interface IRequests {
    "request": Request | Request[]
}

export type TRole = {
    "role": TRoleForResponse | TRoleForResponse[]
}
export type TRoleForResponse =
    Omit<Role, 'company' | 'user' | 'deleteAt'> & {
    user: TUserForResponse;
    company?: TCompanyForResponse;
}

export type TQuiz = {
    "quiz": TQuizForResponse | TQuizForResponse[]
}
export type TQuizForResponse =
    Omit<Quiz, 'company' | 'questions' | 'deleteAt' | 'passedQuiz'> & {
    questions?: Question[];
}


export interface IDeleted {
    "company"?: null
    "user"?: null
    "auth"?: null
    "invite"?: null
    "request"?: null
    "removedUser"?: null
    "quiz"?: number
}