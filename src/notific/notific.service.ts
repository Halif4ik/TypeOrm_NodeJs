import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Notific} from "./entities/notific.entity";
import {Repository} from "typeorm";
import {Company} from "../company/entities/company.entity";
import {User} from "../user/entities/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class NotificService {
   private readonly logger: Logger = new Logger(NotificService.name);

   constructor(
       @InjectRepository(Notific) private readonly notificRepository: Repository<Notific>,
       @InjectRepository(Company) private readonly companyRepository: Repository<Company>,
       private readonly configService: ConfigService,
   ) {
   }

   async createNotificationForCompany(company: Company, text: string): Promise<void> {
      console.log('company-', company);
      console.log('text-', text);
      if (!company.members || !company.members.length) {
         throw new NotFoundException('Company members not found');
      }

      const notificationsForMembers: Notific[] = company.members.map((member: User) => {
         return this.notificRepository.create({
            user: member,
            time: new Date(),
            textNotification: text,
            statusWatched: false,
         });
      });

      this.logger.log(`Create notification for company ${company.id} for ${company.members.length} members`);
      await this.notificRepository.insert(notificationsForMembers);
   }

   async getNotificationsByUser(userId: number, needPage: number, revert: boolean): Promise<Notific[]> {
      if (needPage < 0) needPage = 1;
      const order = revert === true ? 'ASC' : 'DESC';

      return this.notificRepository.find({
         take: this.configService.get<number>("PAGE_PAGINATION"),
         skip: (+needPage - 1) * this.configService.get<number>("PAGE_PAGINATION"),
         order: {
            id: order,
         },
         where: {
            user: {id: userId},
         },
         relations: ["user"],
      });
   }


}
