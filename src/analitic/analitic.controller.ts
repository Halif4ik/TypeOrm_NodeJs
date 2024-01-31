import {Controller, Get, Query, UseGuards, UsePipes, ValidationPipe,} from "@nestjs/common";
import {AnaliticService} from "./analitic.service";
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IAllMembers, IUserInfo, TAvgRating, TGeneralRating,} from "../GeneralResponse/interface/customResponces";
import {JwtRoleAdminGuard} from "../auth/jwt-Role-Admin.guard";
import {AdditionalUpdateQuizCompanyId, UserAndCompanyIdDto} from "../quizz/dto/update-quizz.dto";

@Controller("analitic")
export class AnaliticController {
   constructor(private readonly analiticService: AnaliticService) {
   }

   //1.Logged users can get GENERAL average rating for checked company
   //Endpoint: Get /analitic/my-general-rating
   //Permissions: All logged users
   @Get("/my-general-rating")
   @UseGuards(AuthGuard(["auth0", "jwt-auth"]))
   getMyGeneralRating(@UserDec() userFromGuard: User,): Promise<GeneralResponse<TGeneralRating>> {
      return this.analiticService.getMyGeneralRating(userFromGuard);
   }

   //2.Logged users can get average rating for ALL company and list of passed quiz
   //Endpoint: Get /analitic/avg-rating
   //Permissions: All logged users
   @Get("/avg-rating")
   @UseGuards(AuthGuard(["auth0", "jwt-auth"]))
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   getAvgRating(@UserDec() userFromGuard: User,): Promise<GeneralResponse<TAvgRating>> {
      return this.analiticService.getAvgRating(userFromGuard);
   }

   //3. get average rating for checked company all users
   //Endpoint: Get /analitic/users-avg-rating?companyId=1
   //  Permissions: Admin or Owner user whose data is being exported
   @Get("/users-avg-rating")
   @UseGuards(AuthGuard(["auth0", "jwt-auth"]), JwtRoleAdminGuard)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   getUsersAvgRating(@UserDec() userFromGuard: User, @Query() companyIdDto: AdditionalUpdateQuizCompanyId,): Promise<GeneralResponse<IAllMembers>> {
      return this.analiticService.getUsersAvgRatingByCompany(userFromGuard, companyIdDto.companyId);
   }

   //4. get average AVG rating for checked company checked users
   //Endpoint: Get /analitic/user-avg-rating?userId=6&companyId=1
   //  Permissions: Admin or Owner user whose data is being exported
   @Get("/user-avg-rating")
   @UseGuards(AuthGuard(["auth0", "jwt-auth"]), JwtRoleAdminGuard)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   getUserAvgRating(@Query() userAndCompanyIdDto: UserAndCompanyIdDto): Promise<GeneralResponse<IUserInfo>> {
      return this.analiticService.getUserAvgRating(userAndCompanyIdDto);
   }

   //5. get list users current company
   //Endpoint: Get /analitic/users?companyId=1
   //  Permissions: Admin or Owner user whose data is being exported
   @Get("/users")
   @UseGuards(AuthGuard(["auth0", "jwt-auth"]), JwtRoleAdminGuard)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   getUsers(@Query() companyIdDto: AdditionalUpdateQuizCompanyId,): Promise<GeneralResponse<TAvgRating>> {
      return this.analiticService.getUsersByCompany(companyIdDto.companyId);
   }

}
