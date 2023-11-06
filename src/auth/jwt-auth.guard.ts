import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }
/*decode with Key word for  access Token ONLY*/
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeder = req.headers.authorization;
      let bearer, token;
      if (authHeder) {
        bearer = authHeder.split(" ")[0];
        token = authHeder.split(" ")[1];
      }
      if (bearer !== "Bearer" || !token) throw new UnauthorizedException({ message: "User doesn't authorized with this token" });
      let userFromJwt = this.jwtService.verify( token, { secret: process.env.SECRET_ACCESS} );

      req.user = userFromJwt;
      return req.user;
    } catch (e) {
      console.log("!!e-", e);
      throw new UnauthorizedException({ message: "User doesnt authorized" });
    }
    return undefined;
  }

}