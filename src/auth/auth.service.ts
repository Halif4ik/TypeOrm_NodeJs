import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import * as bcrypt from "bcryptjs";
import {IResponse} from "../user/entities/responce.interface";
import {Repository} from "typeorm";
import {Auth} from "./entities/auth.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {LoginUserDto} from "./dto/login-auth.dto";


@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private userService: UserService, private jwtService: JwtService,
                @InjectRepository(Auth) private authRepository: Repository<Auth>) {
    }

    async login(loginDto: LoginUserDto): Promise<Auth> {
        // should rewrite all tokens return one token
        const userFromBd: User = await this.userService.getUserByEmail(loginDto.email);
        await this.checkUser(userFromBd,loginDto);
        /*contain auth table */
        return this.containOrRefreshBdAuth(userFromBd);
    }

    private async checkUser(userFromBd: User,loginDto:LoginUserDto):Promise<void> {
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
        const passwordCompare = await bcrypt.compare(loginDto.password, userFromBd.password);
        if (!passwordCompare) throw new UnauthorizedException({message: "Incorrect credentials"});
    }

    async registration(userDto: CreateUserDto): Promise<IResponse> {
        const candidate: User = await this.userService.getUserByEmail(userDto.email);
        if (candidate) throw new HttpException("User are present with this E-mail", HttpStatus.BAD_REQUEST);
        const newUser: IResponse = await this.userService.createUser(userDto);
        this.logger.log(`Registered user- ${newUser.detail.user.email}`);

        return newUser;
    }


    getUserInfo(token: string): Promise<User> {
        const user = this.jwtService.decode(token.slice(7));
        return this.userService.getUserByEmail(user['email']);
    }

    async refresh(authToken: string): Promise<Auth> {
        const user = this.jwtService.decode(authToken.slice(7));
        const userFromBd: User = await this.userService.findOne(user['id']);
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect Token for refresh"});

        this.logger.log(`Refresh token for user- ${userFromBd.email}`);
        return this.containOrRefreshBdAuth(userFromBd);
    }

    private async containOrRefreshBdAuth(userFromBd: User): Promise<Auth> {
        let authData: Auth | undefined = await this.authRepository.findOne({where: {userId: userFromBd.id}});

        const action_token: string = this.jwtService.sign({
            email: userFromBd.email,
            id: userFromBd.id,
            firstName: userFromBd.firstName,
            isActive: userFromBd.isActive
        }, {expiresIn: process.env.EXPIRE_ACTION, secret: process.env.SECRET_ACTION});
        const refreshToken: string = this.jwtService.sign({
            email: userFromBd.email,
            id: userFromBd.id,
            firstName: userFromBd.firstName,
            isActive: userFromBd.isActive
        }, {expiresIn: process.env.EXPIRE_REFRESH, secret: process.env.SECRET_REFRESH});
        const accessToken: string = this.jwtService.sign({
            email: userFromBd.email,
            id: userFromBd.id,
            firstName: userFromBd.firstName,
            isActive: userFromBd.isActive
        }, {expiresIn: +process.env.EXPIRE_ACCESS, secret: process.env.SECRET_ACCESS});
        let authDataSave: Auth;
        if (authData) {
            authData.refreshToken = refreshToken;
            authData.accessToken = accessToken;
            authData.action_token = action_token;
            authDataSave = await this.authRepository.save(authData);
            this.logger.log(`Updated tokens for userId- ${authDataSave.userId}`);
        } else {
            const authDataNewUser: Auth = this.authRepository.create({
                userId: userFromBd.id,
                refreshToken,
                accessToken,
                action_token
            });
            authDataSave = await this.authRepository.save(authDataNewUser);
            this.logger.log(`Created tokens for userId- ${authDataSave.userId}`);
        }
        return authDataSave;
    }

}
