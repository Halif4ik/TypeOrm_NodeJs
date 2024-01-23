import {Auth} from "../../auth/entities/auth.entity";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";
import {Invite} from "../../invite/entities/invite.entity";
import {Request} from "../../reqests/entities/reqest.entity";
import {Role} from "../../roles/entities/role.entity";
import {Quiz} from "../../quizz/entities/quizz.entity";
import {Question} from "../../quizz/entities/question.entity";
import {PassedQuiz} from "../../work-flow/entities/passedQuiz.entity";
import {Answers} from "../../quizz/entities/answers.entity";
import {AvgRating} from "../../work-flow/entities/averageRating.entity";
import {GeneralRating} from "../../work-flow/entities/generalRating.entity";

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
export type TGeneralRating = {
    "general-rating": GeneralRating;
}

export type TInviteForResponse = Omit<Invite, 'deleteAt' | 'ownerUser' | 'targetUser'> & {
    ownerUser: TUserForResponse;
    targetUser: TUserForResponse;
}

export type TUserForResponse =
    Omit<User, 'password' | 'deleteAt' | 'auth' | 'company' | 'invite' | 'targetForInvite' |
        'companyMember' | 'requests' | 'roles' | 'passedQuiz' | 'averageRating' | 'isActive'>

export type TCompanyForResponse = Omit<Company, 'deleteAt' | 'owner' | 'members' | 'invites' |
    'quiz' | 'roles' | 'requests' | 'averageRating'>

export type TPassedQuizForResponce = Omit<PassedQuiz, 'user' | 'targetQuiz' | 'rightAnswers' | 'averageRating'> & {
    user?: TUserForResponse;
    targetQuiz?: TQuizForResponse;
    averageRating?: AvgRating;
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

export type TQuiz = { "quiz": TQuizForResponse | TQuizForResponse[] }

export type TAnswers = { "answers": Answers[] }

export type TQuizForResponse =
    Omit<Quiz, 'company' | 'questions' | 'deleteAt' | 'passedQuiz' | 'frequencyInDay' | 'description'>
    & {
    questions?: Question[];
    frequencyInDay?: number;
    description?: string;
}
export type TQuizForResponseRedis =
    Omit<Quiz, 'company' | 'questions' | 'deleteAt' | 'passedQuiz' | 'frequencyInDay' | 'description'>
    & {
    questions?: TQuestion[];
    frequencyInDay?: number;
    description?: string;
}
export type TQuestion = Omit<Question, 'rightAnswer' | 'deleteAt' | 'quiz' | 'varsAnswers'> & {
    rightAnswer?: string;
    deleteAt?: Date;
    quiz?: TQuizForResponse;
    varsAnswers?: TAnswers;
}
export type TRedisData = {
    user: TUserForResponse;
    company: TCompanyForResponse;
    targetQuiz: TQuizForResponseRedis;
    userAnswers?: idAndAnswer [];
}
export type idAndAnswer = {
    'id': number,
    "userAnswer": string,
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
export  type FileResponse = {
    header: {
        'Content-Type': string,
        'Content-Disposition': string,
    },
    data: string
}