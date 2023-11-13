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
import {IResponseAuth} from "./entities/responce-auth.interface";
import {IResponseUser} from "../user/entities/responce.interface";
import * as process from "process";

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private userService: UserService, private jwtService: JwtService,
                @InjectRepository(Auth) private authRepository: Repository<Auth>) {
    }

    async login(loginDto: LoginUserDto): Promise<IResponseAuth> {
        // should rewrite all tokens return one token
        const userFromBd: User = await this.userService.getUserByEmail(loginDto.email);
        await this.checkUserCredentials(userFromBd, loginDto);
        /*contain auth table */
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": await this.containOrRefreshTokenAuthBd(userFromBd),
            },
            "result": "working"
        };

    }

    async registration(userDto: CreateUserDto): Promise<IResponseUser> {
        const newUser: IResponseUser = await this.userService.createUser(userDto);
        this.logger.log(`Registered user- ${newUser.detail.user.email}`);
        return newUser;
    }

    async getUserInfo(token: string): Promise<IResponseUser> {
        const userFromToken = this.jwtService.decode(token.slice(7));
        const userFromBd: User = await this.userService.getUserByEmail(userFromToken['email']);
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": userFromBd,
            },
            "result": "working"
        };
    }

    async refresh(authToken: string): Promise<IResponseAuth> {
        const user = this.jwtService.decode(authToken.slice(7));
        const userFromBd: User = await this.userService.findOne(user['id']);

        this.logger.log(`Refresh token for user- ${userFromBd.email}`);
        return {
            "status_code": 200,
            "detail": {
                "user": await this.containOrRefreshTokenAuthBd(userFromBd),
            },
            "result": "working"
        };

    }

    async deleteAuth(userFromBd: User): Promise<IResponseAuth> {
        console.log('!deleteAuth-',userFromBd);
        const temp = await this.authRepository.remove(userFromBd.auth);
        this.logger.log(`Deleted auth for user- ${userFromBd.email}`);
        return {
            "status_code": 200,
            "detail": {
                "user": temp,
            },
            "result": "working"
        };

    }

    private async containOrRefreshTokenAuthBd(userFromBd: User): Promise<Auth> {
        console.log('***userFromBd-',userFromBd);
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
            console.log('ELSE authDataNewUser-',authDataNewUser);
            /*and add relation in user table*/
            userFromBd.auth = authDataNewUser;
            await this.userService.addRelationAuth(authDataNewUser,userFromBd);

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
