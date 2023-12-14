import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";

@Injectable()
export class JwtStrategyAuth extends PassportStrategy(Strategy, "jwt-auth") {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: process.env.IGNORE_EXPIRATION_TOKEN === 'true',
            secretOrKey: process.env.SECRET_ACCESS,
        });
    }

    async validate(payload: unknown): Promise<User | null> {
        const id: number | undefined = payload['id'];
        if (typeof id !== "number") return null;
        return this.userService.getUserByIdCompTargInviteRole(id);
    }
}