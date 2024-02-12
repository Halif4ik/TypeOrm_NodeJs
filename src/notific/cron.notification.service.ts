import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {NotificationsGateway} from './notifications.gateway';
import {User} from "../user/entities/user.entity";
import {Notific} from "./entities/notific.entity";
import {Quiz} from "../quizz/entities/quizz.entity";
import {PassedQuiz} from "../work-flow/entities/passedQuiz.entity";

@Injectable()
export class CronNotificationService {
   private readonly logger: Logger = new Logger(CronNotificationService.name);

   constructor(
       private readonly notificationsGateway: NotificationsGateway,
       @InjectRepository(Notific)
       private readonly notificationRepository: Repository<Notific>,
       @InjectRepository(User)
       private readonly userRepository: Repository<User>,
       @InjectRepository(PassedQuiz)
       private readonly quizResultRepository: Repository<PassedQuiz>,
   ) {
   }

   /*Every day at 12:00 AM*/
   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
   async sendQuizNotifications() {
      this.logger.log('Cron job started');
      const users: User[] = await this.userRepository.find();
      for (const user of users) {
         await this.checkAndSendNotifications(user);
      }
      this.logger.log('Cron job completed');
   }

   private async checkAndSendNotifications(user: User): Promise<void> {
      const quizPassed: PassedQuiz[] = await this.quizResultRepository.find({
         where: {user: {id: user.id}},
         relations: ['targetQuiz'],
      });
      for (const oneQuizPassed of quizPassed) {
         const targetQuiz: Quiz = oneQuizPassed.targetQuiz;
         const lastQuizDate: Date = oneQuizPassed.updateAt;
         const nextQuizDate: Date = new Date(lastQuizDate);
         nextQuizDate.setDate(nextQuizDate.getDate() + targetQuiz.frequencyInDay);
         const currentDate: Date = new Date();
         if (currentDate > nextQuizDate && !(await this.notificationAlreadySent(user, targetQuiz)))
            await this.sendNotification(user, targetQuiz);
      }
   }

   private async sendNotification(user: User, quiz: Quiz): Promise<void> {
      const notificationText: string = `Не забудьте пройти тест "${quiz.description}"!`;
      const notification: Notific = this.notificationRepository.create({
         user,
         textNotification: notificationText,
         time: new Date(),
      });
      await this.notificationsGateway.sendNotificationToUser(user.id, notificationText);
      await this.notificationRepository.save(notification);
      this.logger.log(`Notification sent to user: ${user.firstName}`);
   }

   private async notificationAlreadySent(user: User, quiz: Quiz): Promise<boolean> {
      const existingNotification: Notific | null = await this.notificationRepository.findOne({
         where: {
            user: {id: user.id},
            statusWatched: true,
            textNotification: `Не забудьте пройти тест "${quiz.description}"!`,
         },
      });
      return !!existingNotification;
   }
}
