import {HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import * as bcrypt from "bcryptjs";
import {Repository} from "typeorm";
import {Auth} from "./entities/auth.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {LoginUserDto} from "./dto/login-auth.dto";
import * as process from "process";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {IRespAuth, IUserInfo} from "../GeneralResponse/interface/customResponces";


@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);

    constructor(private userService: UserService, private jwtService: JwtService,
                @InjectRepository(Auth) private authRepository: Repository<Auth>) {
    }

    async login(loginDto: LoginUserDto): Promise<GeneralResponse<IRespAuth>> {
        // should rewrite all tokens return one token
        const userFromBd: User = await this.userService.getUserByEmailWithAuth(loginDto.email);
        await this.checkUserCredentials(userFromBd, loginDto);
        /*contain auth table */
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "auth": await this.containOrRefreshTokenAuthBd(userFromBd),
            },
            "result": "working"
        };

    }

    async registration(userDto: CreateUserDto): Promise<GeneralResponse<IUserInfo>> {
        const newUser: GeneralResponse<IUserInfo> = await this.userService.createUser(userDto);
        this.logger.log(`Registered user- ${newUser.detail.user.email}`);
        return newUser;
    }

    async getUserInfo(userFromGuard: User): Promise<GeneralResponse<IUserInfo>> {
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": userFromGuard,
            },
            "result": "working"
        };
    }

    async refresh(userFromBd: User): Promise<GeneralResponse<IRespAuth>> {
        this.logger.log(`Refresh token for user- ${userFromBd.email}`);
        return {
            "status_code": 200,
            "detail": {
                "auth": await this.containOrRefreshTokenAuthBd(userFromBd),
            },
            "result": "working"
        };

    }

    private async containOrRefreshTokenAuthBd(userFromBd: User): Promise<Auth> {
        let authData: Auth | undefined = userFromBd.auth;
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
        let authUserDataSave: Auth;
        if (authData) {
            authData.refreshToken = refreshToken;
            authData.accessToken = accessToken;
            authData.action_token = action_token;
            authUserDataSave = await this.authRepository.save(authData);
            this.logger.log(`Updated tokens for userId- ${userFromBd.id}`);
        } else {
            const authDataNewUser: Auth = this.authRepository.create({
                refreshToken,
                accessToken,
                action_token,
                user: userFromBd
            });
            /*and add relation in user table*/
            userFromBd.auth = authDataNewUser;
            await this.userService.addRelationAuth(authDataNewUser, userFromBd);

            authUserDataSave = await this.authRepository.save(authDataNewUser);
            this.logger.log(`Created tokens for userId- ${userFromBd.id}`);
        }
        return authUserDataSave;
    }

    private async checkUserCredentials(userFromBd: User, loginDto: LoginUserDto): Promise<void> {
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
        const passwordCompare = await bcrypt.compare(loginDto.password, userFromBd.password);
        if (!passwordCompare) throw new UnauthorizedException({message: "Incorrect credentials"});
    }

}
