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
export class JwtRoleMemberGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private readonly quizService: QuizService) {
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
            const userFromJwt: User | null = req.user;
            /* if empty body and query for Get StartCase  for Post  - work-flow/answer */
            const quizId: number | null = parseInt(req.query.quizId) || +req?.body?.quizId;
            if (isNaN(quizId))
                throw new UnauthorizedException({message: "Quiz ID is not a number or not present in query"});
            const targetQuiz: Quiz | null = await this.quizService.findQuizById(quizId);
            if (!targetQuiz) throw new UnauthorizedException({message: "Quiz not found"});
            const companyIdFromRequest: number = targetQuiz.company.id;

            // Check maybe user is the member of the current company
            if (userFromJwt?.companyMember?.id === companyIdFromRequest) return true;
            throw new UnauthorizedException({message: "User is not the Member in the company related to the quiz"});
        } catch (e) {
            throw e;
        }
    }
}