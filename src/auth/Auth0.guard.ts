import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticationClient } from 'auth0';
@Injectable()
export class Auth0Guard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const auth0 = new AuthenticationClient({
            domain: 'dev-trabj1pqb1r44ipw.us.auth0.com',
            clientId: 'uixGnlP2o6ViKFwL4sSdYgcGdemsMVcm',
            clientSecret: 'awSzGMJJs408NDQl-FpUvpQk9h-GmNJkBon3-C4ghywrq1KfZtrRp94tPxHML5oS',
        });

        try {
            const authHeder = req.headers.authorization;
            let bearer, token;
            if (authHeder) {
                bearer = authHeder.split(" ")[0];
                token = authHeder.split(" ")[1];
            }
            if (bearer !== "Bearer" || !token) throw new UnauthorizedException({ message: "User doesn't authorized with this token" });
            console.log('options+-+--',token);
            const { data: user } = await auth0.passwordless
            console.log('user+-+--',user);
            return true;
        } catch (e) {
            throw new UnauthorizedException({message: "+++User doesn't authorized with this token"});
        }
    }

}