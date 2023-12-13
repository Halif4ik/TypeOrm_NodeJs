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
            if (isNaN(parseInt(req.query.id)))
                throw new UnauthorizedException({message: "Quiz ID is not a number"});

            /*temporary in Role value present only Admin TODO */
            const listCompanysWhereAdmin: Role[] = userFromJwt.roles.filter((role: Role) => role.value);

            console.log('LIST-', listCompanysWhereAdmin);
            /* console.log('req.user-', req.user);*/
            if (listCompanysWhereAdmin) {
                // Check if user is the owner of the company related to the quiz
                const quizId: number = parseInt(req.query.id);
        /*        const companyWichHasQuiz: Quiz = await this.quizRepository.findOne({
                    where: {id: quizId},
                    relations: ["company"]
                });*/
                const temp = await this.quizService.findAll();
                console.log('temp-', temp);
                /*console.log('companyWichHasQuiz-', companyWichHasQuiz);*/
                const isQuizOwner: boolean =
                    listCompanysWhereAdmin.some((role: Role) => role.company.id === quizId);
                console.log('isQuizOwner-', isQuizOwner);
                if (!isQuizOwner)
                    throw new UnauthorizedException({message: "User is not the owner of the company related to the quiz"});

                return true;
            }

            // Check if user is the owner of the current company
            const isCompanyOwner: boolean = userFromJwt.company.some((company: Company) => company.owner.id === userFromJwt.id);

            if (!isCompanyOwner) {
                throw new UnauthorizedException({message: "User is not the owner or doesn't have the required role"});
            }
            return true;
        } catch (e) {
            throw e;
        }

    }

}