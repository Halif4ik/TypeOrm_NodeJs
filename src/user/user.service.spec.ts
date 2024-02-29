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
import {HttpStatus} from "@nestjs/common";
import {UpdateUserDto} from "./dto/update-user.dto";

const mockUserRepositoryMethods = {
   findOneBy: jest.fn(),
   findOne: jest.fn(),
   create: jest.fn(),
   save: jest.fn(),
   update: jest.fn(),
   remove: jest.fn(),
   findAndCount: jest.fn(),
};

jest.mock('bcryptjs');

describe('UserService', () => {
   let userService: UserService;
   let jwtService: JwtService;
   let userRepository: Repository<User>;

   const createUserDto: CreateUserDto = {
      firstName: 'mockName',
      email: 'mock@test.com',
      password: '123456',
   };

   const updateUserDto: UpdateUserDto = {
      firstName: 'UpdatedFirstNameMock',
      email: 'mock@test.com',
   };

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
               useClass: JwtService,
            },
            {
               provide: getRepositoryToken(User),
               useValue: mockUserRepositoryMethods,
            },
         ],
         imports: [PassportModule.register({})],
      }).compile();

      userService = module.get<UserService>(UserService);
      jwtService = module.get<JwtService>(JwtService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));

      bcrypt.hash.mockResolvedValue('$2a$05$OhWVMeoV9bojvxmPAaJnT.zdMwhjopG.otOoJX/AnqXUZZgLaza2e');
   });

   describe('createUser', () => {
      it('should create a user', async (): Promise<void> => {

         jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
         jest.spyOn(userRepository, 'create').mockReturnValue(mockCreatedUser);
         jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

         const result: GeneralResponse<IUserInfo> = await userService.createUser(createUserDto);

         expect(result.detail.user).toEqual(mockCreatedUser);
         expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
         expect(userRepository.findOneBy).toHaveBeenCalledWith({email: createUserDto.email});
         expect(userRepository.create).toHaveBeenCalledWith({
            ...createUserDto,
            password: '$2a$05$OhWVMeoV9bojvxmPAaJnT.zdMwhjopG.otOoJX/AnqXUZZgLaza2e'
         });
      });
      /**/
      it('should throw a ConflictException if username already exists', async (): Promise<void> => {
         jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockCreatedUser);

         try {
            await userService.createUser(createUserDto);
         } catch (error) {
            expect(error.response).toEqual('User exist in bd');
            expect(error.status).toEqual(HttpStatus.CONFLICT);
         }

         expect(userRepository.findOneBy).toHaveBeenCalledWith({email: createUserDto.email});
         expect(userRepository.create).not.toHaveBeenCalled();
      });
   });

   describe('updateUserInfo', () => {
      it('should update user info', async (): Promise<void> => {

         jest.spyOn(jwtService, 'decode').mockReturnValue(mockCreatedUser);
         jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockCreatedUser);
         jest.spyOn(userRepository, 'save').mockResolvedValue({...mockCreatedUser, ...updateUserDto});

         const result: GeneralResponse<IUserInfo> = await userService.updateUserInfo('tokenFromFront',
             updateUserDto);

         expect(result.detail.user).toEqual({...mockCreatedUser, ...updateUserDto});
         expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
         expect(userRepository.findOneBy).toHaveBeenCalledWith({email: mockCreatedUser.email});
         expect(userRepository.save).toHaveBeenCalledTimes(1);
         expect(userRepository.save).toHaveBeenCalledWith({...mockCreatedUser, ...updateUserDto});
      });
      /**/
      it('should throw a NotFoundException if user not found', async (): Promise<void> => {
         const updateUserDto: UpdateUserDto = {
            firstName: 'UpdatedFirstNameMock',
            email: 'mock@test.com',
         };
         jest.spyOn(jwtService, 'decode').mockReturnValue(mockCreatedUser);
         jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

         try {
            await userService.updateUserInfo('tokenFromFront', updateUserDto);
         } catch (error) {
            expect(error.response).toEqual('User not found');
            expect(error.status).toEqual(HttpStatus.NOT_FOUND);
         }
      });
      /**/
   });
   describe('deleteUser', (): void => {
      it('should delete user', async (): Promise<void> => {
         jest.spyOn(jwtService, 'decode').mockReturnValue(mockCreatedUser);
         jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockCreatedUser);
         jest.spyOn(userRepository, 'remove').mockResolvedValue(mockCreatedUser);

         const result: GeneralResponse<IUserInfo> = await userService.deleteUser('tokenFromFront', updateUserDto);

         expect(userRepository.findOne).toHaveBeenCalledTimes(1);
         expect(result.detail.user).toEqual(mockCreatedUser);
      });
      /**/
      it('should throw a NotFoundException if user not found', async (): Promise<void> => {
         const updateUserDto: UpdateUserDto = {
            firstName: 'UpdatedFirstNameMock',
            email: 'mock@test.com',
         }
         jest.spyOn(jwtService, 'decode').mockReturnValue(mockCreatedUser);
         jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
         try {
            await userService.deleteUser('tokenFromFront', updateUserDto);
         } catch (error) {
            expect(error.response).toEqual('User not found');
            expect(error.status).toEqual(HttpStatus.NOT_FOUND);
         }

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