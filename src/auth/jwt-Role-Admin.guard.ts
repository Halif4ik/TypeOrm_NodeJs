import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {User} from "../user/entities/user.entity";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./role-auth-decor";
import {Role} from "../roles/entities/role.entity";
import {Company} from "../company/entities/company.entity";
import {Quiz} from "../quizz/entities/quizz.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QuizService} from "../quizz/quizService";

@Injectable()
export class JwtRoleAdminGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private readonly quizService: QuizService) {
    }

    /*decode with Key word for refreshToken*/
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        /*console.log('req-', req);*/
        try {
            const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            /*we made verify in strategy */
            const userFromJwt: User | null = req.user;
            if (!userFromJwt) throw new UnauthorizedException({message: "User doesnt authorized=)"});

            let companyId: number = +req?.body?.companyId;
            /*for Get*/
            if (!companyId) companyId = +req?.query?.companyId;
            /*for Del and Post*/
            if (!companyId) {
                if (isNaN(parseInt(req.query.id)))
                    throw new UnauthorizedException({message: "Quiz ID is not a number"});
                const quizId: number = parseInt(req.query.id);
                const targetQuiz: Quiz | null = await this.quizService.findQuizById(quizId);
                if (!targetQuiz) throw new UnauthorizedException({message: "Quiz not found"});
                companyId = targetQuiz.company.id;
            }

            /*temporary in Role value present only Admin */
            const listCompanysWhereAdmin: Role[] = userFromJwt.roles.filter((role: Role) => role.value);
            if (listCompanysWhereAdmin) {
                // Check if user is the Admin of the company related to the quiz
                const isQuizAdmin: boolean =
                    listCompanysWhereAdmin.some((role: Role) => role.company.id === companyId);
                if (isQuizAdmin) return true;
            }

            // Check maybe user is the owner of the current company
            const isCompanyOwner: boolean = userFromJwt.company.some((company: Company) => company.id === companyId);
            if (!isCompanyOwner)
                throw new UnauthorizedException({message: "User is not the OWNER and isn't Admin in the company related to the quiz"});
            return true;
        } catch (e) {
            throw e;
        }

    }
}