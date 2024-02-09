import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {User} from "../user/entities/user.entity";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./role-auth-decor";

@Injectable()
export class JwtRoleMemberGuardCompIdBody implements CanActivate {
   constructor(private reflector: Reflector) {
   }

   /*decode with Key word for refreshToken*/
   async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();

      try {
         const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
         ]);
         /*we made verify in strategy */
         const userFromJwt: User | null = req.user;
         /* if empty body and query for Get StartCase  for Post  - work-flow/answer */
         const companyIdFromRequest: number | null = +req?.body?.companyId;
         if (!companyIdFromRequest) throw new UnauthorizedException({message: "Company ID is not present in body"});
         // Check maybe user is the member of the current company
         if (userFromJwt.companyMember.some(curentComp => curentComp.id === companyIdFromRequest)) return true;
         throw new UnauthorizedException({message: `User is not the Member in ${companyIdFromRequest} company related`});
      } catch (e) {
         throw e;
      }
   }
}