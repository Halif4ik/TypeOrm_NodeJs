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


@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private userService: UserService, private jwtService: JwtService,
                @InjectRepository(Auth) private authRepository: Repository<Auth>) {
    }

    async login(loginDto: LoginUserDto): Promise<IResponseAuth> {
        // should rewrite all tokens return one token
        const userFromBd: User = await this.userService.getUserByEmail(loginDto.email);
        await this.checkUser(userFromBd, loginDto);
        /*contain auth table */
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": await this.containOrRefreshTokenAuthBd(userFromBd),
            },
            "result": "working"
        };

    }

    private async checkUser(userFromBd: User, loginDto: LoginUserDto): Promise<void> {
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
        const passwordCompare = await bcrypt.compare(loginDto.password, userFromBd.password);
        if (!passwordCompare) throw new UnauthorizedException({message: "Incorrect credentials"});
    }

    async registration(userDto: CreateUserDto): Promise<IResponseUser> {
        const newUser: IResponseUser = await this.userService.createUser(userDto);
        this.logger.log(`Registered user- ${newUser.detail.user.email}`);
        return newUser;
    }


    async getUserInfo(token: string): Promise<IResponseUser> {
        const user = this.jwtService.decode(token.slice(7));
        return
    }

    async refresh(authToken: string): Promise<IResponseAuth> {
        const user = this.jwtService.decode(authToken.slice(7));
        const userFromBd: User = await this.userService.findOne(user['id']);
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect Token for refresh"});

        this.logger.log(`Refresh token for user- ${userFromBd.email}`);
        return {
            "status_code": 200,
            "detail": {
                "user": await this.containOrRefreshTokenAuthBd(userFromBd),
            },
            "result": "working"
        };

    }

    private async containOrRefreshTokenAuthBd(userFromBd: User): Promise<Auth> {
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
        let authUserDataSave: Auth;
        if (authData) {
            authData.refreshToken = refreshToken;
            authData.accessToken = accessToken;
            authData.action_token = action_token;
            authUserDataSave = await this.authRepository.save(authData);
            this.logger.log(`Updated tokens for userId- ${authUserDataSave.userId}`);
        } else {
            const authDataNewUser: Auth = this.authRepository.create({
                userId: userFromBd.id,
                refreshToken,
                accessToken,
                action_token
            });
            authUserDataSave = await this.authRepository.save(authDataNewUser);
            this.logger.log(`Created tokens for userId- ${authUserDataSave.userId}`);
        }
        return authUserDataSave;
    }

}
