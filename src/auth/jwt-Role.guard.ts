import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./role-auth-decor";
import {Role} from "../roles/entities/role.entity";

@Injectable()
export class JwtRoleGuard implements CanActivate {
    constructor(private jwtService: JwtService, private readonly userService: UserService,
                private reflector: Reflector) {
    }

    /*decode with Key word for refreshToken*/
    async canActivate(context: ExecutionContext): Promise<true> {
        const req = context.switchToHttp().getRequest();
        try {
            const requiredRoles = this.reflector.getAllAndOverride(ROLE_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            const authHeder = req.headers.authorization;
            let bearer, token;
            if (authHeder) {
                bearer = authHeder.split(" ")[0];
                token = authHeder.split(" ")[1];
            }
            if (bearer !== "Bearer" || !token)
                throw new UnauthorizedException({message: "User doesnt authorized"});

            const userFromJwt = this.jwtService.verify(token, {secret: process.env.SECRET_ACCESS});

            /*because in jwt/aith0 token always present email*/
            const userFromBd: User | null = await this.userService.getUserByEmailWithRole(userFromJwt['email']);
            const isAdminRoleInUser: boolean = userFromBd.roles.some((role: Role) => requiredRoles.includes(role.value));

            if (!isAdminRoleInUser) throw new UnauthorizedException({message: "User doesnt have admin role"});
            req.user = userFromBd;
            return isAdminRoleInUser;
        } catch (e) {
            throw new UnauthorizedException({message: "User doesnt have admin role"});
        }
    }

}