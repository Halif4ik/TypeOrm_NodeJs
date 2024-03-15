import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PassportModule} from "@nestjs/passport";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import {AuthService} from "./auth.service";
import {ConfigService} from "@nestjs/config";
import {Auth} from "./entities/auth.entity";
import * as bcrypt from "bcryptjs";
import {LoginUserDto} from "./dto/login-auth.dto";
import {UserService} from "../user/user.service";

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

describe('AuthService', () => {
   let authService: AuthService;
   let jwtService: JwtService;
   let userRepository: Repository<User>;
   let configService: ConfigService;
   let authRepository: Repository<Auth>;


   beforeEach(async (): Promise<void> => {
      jest.clearAllMocks();

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            UserService,
            {
               provide: JwtService, // Provide JwtService
               useValue: {
                  sign: jest.fn(),
                  verify: jest.fn(),
               },
            },
            {
               provide: ConfigService,
               useValue: {
                  get: jest.fn(),
               },
            },
            {
               provide: getRepositoryToken(User),
               useValue: mockUserRepositoryMethods,
            },
            {
               provide: getRepositoryToken(Auth),
               useClass: Auth,
            },
         ],
         imports: [PassportModule.register({})],
      }).compile();

      authService = module.get<AuthService>(AuthService);
      jwtService = module.get<JwtService>(JwtService);
      configService = module.get<ConfigService>(ConfigService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
      authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));

      bcrypt.compare.mockResolvedValue(true);
   });


   it('should add new JWT tokens or create relation Auth User', async (): Promise<void> => {

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockCreatedUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('MOCK_TOKEN');
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockCreatedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

      const result = await authService.login(loginUserDto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({email: loginUserDto.email});

   });
   /**/
   const loginUserDto: LoginUserDto = {
      email: 'mock@test.com',
      password: '123456',
   };
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