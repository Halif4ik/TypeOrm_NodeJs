import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {TJwtBody} from "../GeneralResponse/interface/customResponces";
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JwtStrategyAuth extends PassportStrategy(Strategy, "jwt-auth") {
    constructor(private readonly userService: UserService,
                private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: configService.get<string>("IGNORE_EXPIRATION_TOKEN") === 'true',
            secretOrKey: configService.get<string>("SECRET_ACCESS"),

        });
    }

    async validate(payload: unknown): Promise<User | null> {
        if (typeof payload !== 'object' || payload === null) return null;
        // jwt Payload is missing a required property and this point, payload is of type TJwtBody
        const requiredProperties: (keyof TJwtBody)[] = ['id', 'email', 'firstName'];
        for (const prop of requiredProperties) {
            if (!(prop in payload)) return null;
            if (prop === 'id' && typeof payload[prop] !== 'number') return null;
        }

        const jwtBody: TJwtBody = {
            email: payload['email'],
            id: payload['id'],
            firstName: payload['firstName'],
            iat: payload['iat'],
            exp: payload['exp'],
        };
        return this.userService.getUserByIdCompTargInviteRole(jwtBody.id);
    }
}