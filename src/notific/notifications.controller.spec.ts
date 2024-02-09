import {Test, TestingModule} from '@nestjs/testing';
import {NotificationsController} from './notifications.controller';
import {NotificationsService} from './notifications.service';
import {Notification} from './entity/notification.entity';
import {NotFoundException} from '@nestjs/common';

const mockNotificationsService = {
  getNotificationsByUser: jest.fn(),
  markNotificationAsRead: jest.fn(),
};

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  describe('getNotificationsByUser', () => {
    it('should return paginated notifications for a user', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;
      const mockNotifications: Notification[] = [];

      const result = await controller.getNotificationsByUser(userId, page, limit);

      expect(result).toEqual({
        data: mockNotifications,
        totalCount: mockNotifications.length,
        page,
        limit,
      });
      expect(mockNotificationsService.getNotificationsByUser).toHaveBeenCalledWith(userId, page, limit);
    });

    it('should handle invalid user ID', async () => {
      const userId = 'invalid';
      const page = 1;
      const limit = 10;

      await expect(controller.getNotificationsByUser(userId as any, page, limit)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockNotificationsService.getNotificationsByUser).not.toHaveBeenCalled();
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationId = 1;
      const mockNotification = {
        id: notificationId,
        text: 'Hello',
        user: {},
      };

      mockNotificationsService.markNotificationAsRead.mockResolvedValueOnce(mockNotification);

      const result = await controller.markNotificationAsRead(notificationId);

      expect(result).toEqual(mockNotification);
      expect(mockNotificationsService.markNotificationAsRead).toHaveBeenCalledWith(notificationId);
    });

    it('should handle invalid notification ID', async () => {
      const notificationId = 'invalid';

      await expect(controller.markNotificationAsRead(notificationId as any)).rejects.toThrowError(NotFoundException);
      expect(mockNotificationsService.markNotificationAsRead).not.toHaveBeenCalled();
    });
  });
});
