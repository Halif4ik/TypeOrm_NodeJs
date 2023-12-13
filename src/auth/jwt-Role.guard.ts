import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./role-auth-decor";
import {Role} from "../roles/entities/role.entity";
import {Company} from "../company/entities/company.entity";

@Injectable()
export class JwtRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {
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
            if (!userFromJwt) throw new UnauthorizedException({message: "User doesnt authorized=)"});

            /*temporary in Role value present only Admin  */
            const listCompanysWhereAdmin: Role[] = userFromJwt.roles.filter((role: Role) => role.value);
            if (listCompanysWhereAdmin) return true;

            //check if user owner on SOME company
            const foundCompany: boolean = userFromJwt.company.some((company: Company): boolean =>
                company.owner.id === userFromJwt.id);

            if (!foundCompany)
                throw new UnauthorizedException({message: "User doesnt has any owner or admin role"});
            return true;
        } catch (e) {
            throw e;
        }

    }

}