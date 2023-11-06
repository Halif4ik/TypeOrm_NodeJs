import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthRefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }
/*decode with Key word for refreshToken  ONLY*/
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeder = req.headers.authorization;
      let bearer, token;
      if (authHeder) {
        bearer = authHeder.split(" ")[0];
        token = authHeder.split(" ")[1];
      }
      if (bearer !== "Bearer" || !token) throw new UnauthorizedException({ message: "User doesnt authorized" });
      let userFromJwt = this.jwtService.verify( token, { secret: process.env.SECRET_REFRESH} );

      req.user = userFromJwt;
      return req.user;
    } catch (e) {
      console.log("!!e-", e);
      throw new UnauthorizedException({ message: "User doesnt authorized" });
    }
    return undefined;
  }

}