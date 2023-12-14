import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {Company} from "../company/entities/company.entity";

export const CompanyDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Company => {
        const request = ctx.switchToHttp().getRequest();
        return request.company;
    },
);

