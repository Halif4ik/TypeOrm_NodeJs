import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {User} from '../user/entities/user.entity';

export const UserDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

