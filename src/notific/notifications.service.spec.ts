import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {NotificationsGateway} from './notifications.gateway';
import {Notific} from "./entities/notific.entity";
import {NotificService} from "./notific.service";
import {Company} from "../company/entities/company.entity";
import {Repository} from "typeorm";
import {ConfigService} from "@nestjs/config";

const mockNotificationRepository = {
   find: jest.fn(),
   findOne: jest.fn(),
   insert: jest.fn(),
   save: jest.fn(),
};
const mockCompanyRepository = {
   findOne: jest.fn().mockReturnThis(),
   relations: jest.fn().mockReturnThis(),
   where: jest.fn(),
};

const mockNotificationsGateway = {
   sendNotificationToUser: jest.fn(),
};

describe('NotificationsService', () => {
   let notifService: NotificService;
   let companyRepository: Repository<Company>;
   let mockConfigService = {};

   beforeEach(async (): Promise<void> => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            NotificService,
            {
               provide: getRepositoryToken(Notific),
               useValue: mockNotificationRepository,
            },
            {
               provide: ConfigService, // Provide ConfigService
               useValue: mockConfigService, // Use a mock implementation
            },
            {
               provide: getRepositoryToken(Company),
               useValue: mockCompanyRepository,
            },
            {
               provide: NotificationsGateway,
               useValue: mockNotificationsGateway,
            },
         ],
      }).compile();

      notifService = module.get<NotificService>(NotificService);
      companyRepository = module.get<Repository<Company>>(getRepositoryToken(Company));
   });
   afterEach(() => {
      jest.clearAllMocks();
   });

   describe('createNotificationForCompany', () => {
      it('should create notifications for members passed company', async (): Promise<void> => {
         const companyId = 1;
         const testText = 'Test text notific';
         const mockCompany = {
            id: companyId,
            members: [{id: 1}, {id: 2}],
         } as Company;

         mockCompanyRepository.findOne.mockResolvedValueOnce(mockCompany);

         await notifService.createNotificationForCompany(mockCompany, testText);

         expect(mockCompanyRepository.where).toHaveBeenCalledWith('company.id = :companyId', {companyId});

         expect(mockNotificationsGateway.sendNotificationToUser).toHaveBeenCalledTimes(2);
         expect(mockNotificationRepository.insert).toHaveBeenCalledWith([
            {user: {id: 1}, time: expect.any(Date), text: testText},
            {user: {id: 2}, time: expect.any(Date), text: testText},
         ]);
      });

   });

   /*ross-env NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1 --detectOpenHandles --logHeapUsage --no-cache"
"cross-env NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1 --detectOpenHandles --logHeapUsage --no-cache",*/

});
