import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";

@Injectable()
export class JwtAuthRefreshGuard implements CanActivate {
    constructor(private jwtService: JwtService, private readonly userService: UserService) {
    }

    /*decode with Key word for refreshToken  ONLY*/
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeder = req.headers.authorization;
            let bearer, token;
            if (authHeder) {
                bearer = authHeder.split(" ")[0];
                token = authHeder.split(" ")[1];
            }
            if (bearer !== "Bearer" || !token) throw new UnauthorizedException({message: "User doesnt authorized"});
            let userFromJwt = this.jwtService.verify(token, {secret: process.env.SECRET_REFRESH});
            /*becouse in jwt always present id*/
            const userFromBd: User | null = userFromJwt['email'] ? await this.userService.getUserByIdWithCompany(userFromJwt['id']) : null;
            req.user = userFromBd;
            return req.user;
        } catch (e) {
            console.log("!!e-", e);
            throw new UnauthorizedException({message: "User doesnt authorized"});
        }
        return undefined;
    }

}