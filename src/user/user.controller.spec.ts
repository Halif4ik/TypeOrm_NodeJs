import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entities/user.entity';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IUserInfo} from "../GeneralResponse/interface/customResponces";
import {HttpStatus} from "@nestjs/common";
import {UserController} from "./user.controller";
import {JwtService} from "@nestjs/jwt";

const mockUserRepositoryMethods = {
   findOneBy: jest.fn(),
   findOne: jest.fn(),
   create: jest.fn(),
   save: jest.fn(),
   update: jest.fn(),
   remove: jest.fn(),
   findAndCount: jest.fn(),
};

describe('UserController', () => {
   let userService: UserService;
   let userController: UserController;
   let userRepository: Repository<User>;

   const createUserDto: CreateUserDto = {
      firstName: 'mockName',
      email: 'mock@test.com',
      password: '123456',
   };

   beforeEach(async (): Promise<void> => {
      jest.clearAllMocks();

      const module: TestingModule = await Test.createTestingModule({
         controllers: [UserController],
         providers: [
            UserService,
            JwtService,
            {
               provide: getRepositoryToken(User),
               useValue: mockUserRepositoryMethods,
            },
         ],
      }).compile();

      userController = module.get<UserController>(UserController);
      userService = module.get<UserService>(UserService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
   });
   /**/
   it('should be defined', () => {
      expect(userController).toBeDefined();
   });

   describe('createUser', () => {
      it('should create a user', async (): Promise<void> => {

         jest.spyOn(userService, 'createUser').mockResolvedValue({
            "status_code": HttpStatus.OK,
            "detail": {
               "user": mockCreatedUser
            },
            "result": "createUser"
         } as GeneralResponse<IUserInfo>);

         const result: GeneralResponse<IUserInfo> = await userController.create(createUserDto);

         expect(result.detail.user).toEqual(mockCreatedUser);
         expect(userService.createUser).toHaveBeenCalledWith(createUserDto);

      });
   });

   /**/
   const mockCreatedUser: User = {
      id: 1,
      firstName: 'mockName',
      email: 'mock@test.com',
      password: '123456',
      isActive: true,
      auth: {
         id: 1,
         createAt: new Date(),
         deleteAt: null,
         upadateAt: new Date(),
         action_token: 'mockToken',
         refreshToken: 'mockRefresh token',
         accessToken: 'mockAccess token',
         user: null,
      },
      roles: [],
      companyMember: [],
      invite: [],
      requests: [],
      passedQuiz: [
         /*{
            id: 10,
            createDate: new Date(),
            targetQuiz: {
               id: 1,
               frequencyInDay: 7,
               company: {id: 2, name: 'mocCompanyN', description: 'compDesc', deleteAt: new Date()}
            }
         },*/
      ],
      targetForInvite: [],
      averageRating: [],
      company: [],
      notific: [],
      deleteAt: null,
   };
});