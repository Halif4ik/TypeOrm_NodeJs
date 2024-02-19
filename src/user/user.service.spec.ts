import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entities/user.entity';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IUserInfo} from "../GeneralResponse/interface/customResponces";
import {PassportModule} from "@nestjs/passport";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

const mockUserRepositoryMethods = {
   findOneBy: jest.fn(),
   create: jest.fn(),
   save: jest.fn(),
   update: jest.fn(),
   softDelete: jest.fn(),
   findAndCount: jest.fn(),
   createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
   })),
};

jest.mock('bcryptjs');

describe('UsersService', () => {
   let userService: UserService;
   let userRepository: Repository<User>;

   const createUserDto: CreateUserDto = {
      firstName: 'mockName',
      email: 'mock@test.com',
      password: '123456',
   };
   const mockBdId = 1;


   beforeEach(async (): Promise<void> => {
      jest.clearAllMocks();

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            /*UserService,*/
            {
               provide: UserService,
               useClass: UserService,
            },
            {
               provide: JwtService, // Provide JwtService
               useValue: {}, // You can provide a mock object if needed
            },
            {
               provide: getRepositoryToken(User),
               useValue: mockUserRepositoryMethods,
            },
         ],
         imports: [PassportModule.register({})],
      }).compile();

      userService = module.get<UserService>(UserService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
   });


   describe('createUser', () => {
      it('should create a user', async (): Promise<void> => {
         bcrypt.hash.mockResolvedValue('$2a$05$OhWVMeoV9bojvxmPAaJnT.zdMwhjopG.otOoJX/AnqXUZZgLaza2e');

         jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
         jest.spyOn(userRepository, 'create').mockReturnValue(mockCreatedUser);
         jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

         const result: GeneralResponse<IUserInfo> = await userService.createUser({
            ...createUserDto,
            password: '$2a$05$OhWVMeoV9bojvxmPAaJnT.zdMwhjopG.otOoJX/AnqXUZZgLaza2e'
         });

         expect(result.detail.user).toEqual(mockCreatedUser);
         expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
         expect(userRepository.findOneBy).toHaveBeenCalledWith({email: createUserDto.email});
         expect(userRepository.create).toHaveBeenCalledWith({...createUserDto,
            password: '$2a$05$OhWVMeoV9bojvxmPAaJnT.zdMwhjopG.otOoJX/AnqXUZZgLaza2e'});
      });

   });

});


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