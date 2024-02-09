import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {User} from "../user/entities/user.entity";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./role-auth-decor";
import {Role} from "../roles/entities/role.entity";
import {Company} from "../company/entities/company.entity";
import {Quiz} from "../quizz/entities/quizz.entity";
import {QuizService} from "../quizz/quizService";
import {UserService} from "../user/user.service";

@Injectable()
export class JwtRoleAdminGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private readonly quizService: QuizService,
                private readonly userService: UserService) {
    }

    /*decode with Key word for refreshToken*/
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            /*we made verify in strategy */
            const userFromJwt2: User | null = req.user;
            const userFromJwt: User | null =  await this.userService.getUserByIdCompTargInviteRole(req.user.id)
            console.log('userFromJwt',userFromJwt);
            /*if for Post*/  /* ||if for Get*/
            let companyIdFromRequest: number | undefined = +req?.body?.companyId || +req?.query?.companyId;
            /* if empty body and query for Del case*/
            if (!companyIdFromRequest) {
                const quizId: number | null  = parseInt(req.query.quizId); /*todo test*/
                if (isNaN(quizId))
                    throw new UnauthorizedException({message: "Quiz ID is not a number or not present in query"});
                const targetQuiz: Quiz | null = await this.quizService.findQuizById(quizId);
                if (!targetQuiz) throw new UnauthorizedException({message: "Quiz not found"});
                companyIdFromRequest = targetQuiz.company.id;
            }

            /*temporary in Role value present only Admin but we find in arr ['admin'] wich we attach in @Roles*/
            const listCompanysWhereAdmin: Company[] = userFromJwt.roles.map((role: Role) => {
                if (requiredRoles.includes(role.value)) return role.company;
            });
            if (listCompanysWhereAdmin) {
                // Check if user is the Admin of the company related to the quiz
                const isQuizAdmin: Company =
                    listCompanysWhereAdmin.find((company: Company) => company.id === companyIdFromRequest);
                if (isQuizAdmin) {
                    req.company = isQuizAdmin;
                    return true;
                }
            }

            // Check maybe user is the owner of the current company
            const isCompanyOwner: Company = userFromJwt.company.find((company: Company) => company.id === companyIdFromRequest);
            if (!isCompanyOwner)
                throw new UnauthorizedException({message: "User is not the OWNER and isn't Admin in the company related to the quiz"});
            console.log('isCompanyOwner-',isCompanyOwner);
            req.company = isCompanyOwner;
            return true;
        } catch (e) {
            throw e;
        }

    }
}