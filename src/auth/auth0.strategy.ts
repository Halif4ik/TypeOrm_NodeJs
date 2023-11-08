import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {passportJwtSecret} from "jwks-rsa";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import * as process from "process";
import {IResponseUser} from "../user/entities/responce.interface";

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, "auth0") {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.AUTH0_ISSUER_URL_DOMAIN}.well-known/jwks.json`,
            }),
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER_URL_DOMAIN,
            algorithms: ["RS256"],
        });
    }

    public async validate(payload: unknown): Promise<User> {
        const email = payload['email']
        const firstName = payload['name']
        if (!email) throw new UnauthorizedException();

        const userFromBd: User | null = email ? await this.userService.getUserByEmail(email) : null;
        /*create user in bd*/
        if (!userFromBd) {
            const createdUser:IResponseUser = await this.userService.createUser({
                email: email,
                password: email + firstName,
                firstName
            });
            const newUser:User = createdUser.detail.user;
            return newUser;
        }
        /*or return user from bd*/
        return userFromBd;
    }
}
