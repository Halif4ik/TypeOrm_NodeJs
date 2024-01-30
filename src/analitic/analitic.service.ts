import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {User} from "../user/entities/user.entity";
import {GeneralRating} from "../work-flow/entities/generalRating.entity";
import {QuizService} from "../quizz/quizService";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AvgRating} from "../work-flow/entities/averageRating.entity";
import {ConfigService} from "@nestjs/config";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IAllMembers, IUserInfo, TAvgRating, TGeneralRating,} from "../GeneralResponse/interface/customResponces";
import {CompanyService} from "../company/company.service";
import {UserService} from "../user/user.service";
import {Company} from "../company/entities/company.entity";
import {UserAndCompanyIdDto} from "../quizz/dto/update-quizz.dto";

@Injectable()
export class AnaliticService {
   private readonly logger: Logger = new Logger(AnaliticService.name);

   constructor(
       private quizService: QuizService,
       @InjectRepository(GeneralRating) private generalRatingRepository: Repository<GeneralRating>,
       @InjectRepository(AvgRating) private avgRatingRepository: Repository<AvgRating>,
       private companyService: CompanyService,
       private userService: UserService,
       private readonly configService: ConfigService,
   ) {
   }

   async getMyGeneralRating(userFromGuard: User,): Promise<GeneralResponse<TGeneralRating>> {
      const generalRating: GeneralRating | null =
          await this.generalRatingRepository.findOne({
             where: {
                user: {id: userFromGuard.id},
             },
             relations: ["user"],
          });
      if (!generalRating)
         throw new HttpException(
             "General rating didnt create",
             HttpStatus.NOT_FOUND,
         );
      return {
         status_code: HttpStatus.OK,
         detail: {
            "general-rating": generalRating,
         },
         result: "found",
      };
   }

   async getAvgRating(userFromGuard: User): Promise<GeneralResponse<TAvgRating>> {
      const avgRating: AvgRating[] = await this.avgRatingRepository.find({
         where: {
            user: {id: userFromGuard.id},
         },
         relations: ["passedCompany", "passedQuiz"],
      });
      if (!avgRating)
         throw new HttpException("Avg rating didnt create", HttpStatus.NOT_FOUND);

      return {
         status_code: HttpStatus.OK,
         detail: {
            "avg-rating": avgRating,
         },
         result: "found",
      };
   }

   async getUsersAvgRatingByCompany(userFromGuard: User, companyId: number): Promise<GeneralResponse<IAllMembers>> {
      const isCompanyExist: boolean = userFromGuard.company.some((company: Company): boolean => company.id === companyId);
      if (!isCompanyExist) throw new HttpException(`Company with this ${companyId}ID not found in this owner`, HttpStatus.NOT_FOUND);

      const usersAvgRating: User[] = await this.userService.findUsersAvgRating(companyId);
      if (!usersAvgRating) throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
      return {
         status_code: HttpStatus.OK,
         detail: {
            "members": usersAvgRating,
         },
         result: "found",
      };
   }

   async getUserAvgRating( userAndCompanyIdDto: UserAndCompanyIdDto): Promise<GeneralResponse<IUserInfo>> {
      const currentUser: User = await this.userService.getUserByIdWithAvg(userAndCompanyIdDto.userId, userAndCompanyIdDto.companyId);
      if (!currentUser) throw new HttpException('User not found in this company', HttpStatus.NOT_FOUND);
      return {
         status_code: HttpStatus.OK,
         detail: {
            "user": currentUser,
         },
         result: "found",
      };
   }

   async getUsersByCompany(companyId: number):Promise<GeneralResponse<any>> {
      const currentUser = await this.companyService.getUsersWithAvg(companyId);
      console.log('currentUser-',currentUser);
      if (!currentUser) throw new HttpException('Users not found in this company', HttpStatus.NOT_FOUND);

      return {
         status_code: HttpStatus.OK,
         detail: {
            "members": currentUser,
         },
         result: "found",
      };
   }
}
