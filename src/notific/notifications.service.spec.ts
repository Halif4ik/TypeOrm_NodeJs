import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Company } from '../company/entity/company.entity';
import { NotFoundException } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

const mockNotificationRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  save: jest.fn(),
};

const mockCompanyRepository = {
  createQueryBuilder: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
};

const mockNotificationsGateway = {
  sendNotificationToUser: jest.fn(),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
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

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotificationForCompany', () => {
    it('should create notifications for company members', async () => {
      const companyId = 1;
      const text = 'Test notification';
      const mockCompany = {
        id: companyId,
        members: [{ id: 1 }, { id: 2 }],
      };
      mockCompanyRepository.getOne.mockResolvedValueOnce(mockCompany as Company);

      await service.createNotificationForCompany(companyId, text);

      expect(mockCompanyRepository.createQueryBuilder).toHaveBeenCalledWith('company');
      expect(mockCompanyRepository.leftJoinAndSelect).toHaveBeenCalledWith('company.members', 'user');
      expect(mockCompanyRepository.where).toHaveBeenCalledWith('company.id = :companyId', { companyId });
      expect(mockNotificationsGateway.sendNotificationToUser).toHaveBeenCalledTimes(2);
      expect(mockNotificationRepository.insert).toHaveBeenCalledWith([
        { user: { id: 1 }, time: expect.any(Date), text },
        { user: { id: 2 }, time: expect.any(Date), text },
      ]);
    });

    it('should throw NotFoundException if company or members not found', async () => {
      const companyId = 1;
      const text = 'Test notification';
      mockCompanyRepository.getOne.mockResolvedValueOnce(null);

      await expect(service.createNotificationForCompany(companyId, text)).rejects.toThrowError(NotFoundException);

      expect(mockCompanyRepository.createQueryBuilder).toHaveBeenCalledWith('company');
      expect(mockCompanyRepository.leftJoinAndSelect).toHaveBeenCalledWith('company.members', 'user');
      expect(mockCompanyRepository.where).toHaveBeenCalledWith('company.id = :companyId', { companyId });
      expect(mockNotificationsGateway.sendNotificationToUser).not.toHaveBeenCalled();
      expect(mockNotificationRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe('getNotificationsByUser', () => {
    it('should return paginated notifications for a user', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;
      const mockNotifications: Notification[] = [];

      mockNotificationRepository.find.mockResolvedValueOnce(mockNotifications);

      const result = await service.getNotificationsByUser(userId, page, limit);

      expect(result).toEqual({
        data: mockNotifications,
        totalCount: mockNotifications.length,
        page,
        limit,
      });
      expect(mockNotificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { time: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });
    });

    it('should throw NotFoundException if failed to retrieve notifications', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;

      mockNotificationRepository.find.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getNotificationsByUser(userId, page, limit)).rejects.toThrowError(NotFoundException);

      expect(mockNotificationRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { time: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationId = 1;
      const mockNotification = {};

      mockNotificationRepository.findOne.mockResolvedValueOnce(mockNotification);

      const result = await service.markNotificationAsRead(notificationId);

      expect(result).toEqual(mockNotification);
      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ where: { id: notificationId } });
      expect(mockNotificationRepository.save).toHaveBeenCalledWith({ ...mockNotification, status: expect.any(Number) });
    });

    it('should throw NotFoundException if notification not found', async () => {
      const notificationId = 1;

      mockNotificationRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.markNotificationAsRead(notificationId)).rejects.toThrowError(NotFoundException);

      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ where: { id: notificationId } });
      expect(mockNotificationRepository.save).not.toHaveBeenCalled();
    });
  });
});
