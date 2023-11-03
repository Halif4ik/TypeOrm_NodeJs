import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import * as bcrypt from "bcryptjs";
import {IResponse} from "../user/entities/responce.interface";
import {Repository} from "typeorm";
import {Auth} from "./entities/auth.entity";

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private userService: UserService, private jwtService: JwtService,
                private authRepository: Repository<Auth>) {
    }

    async login(userDto: CreateUserDto) {
        // should rewrite all tokens return one token
        const userFromBd = await this.userService.getUserByEmail(userDto.email);
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect E-mail"});

        const passwordCompare = await bcrypt.compare(userDto.password, userFromBd.password);
        if (!passwordCompare) throw new UnauthorizedException({message: "Incorect password"});

        return this.generateToken(userFromBd);
    }

    async registration(userDto: CreateUserDto) {
        const candidate: User = await this.userService.getUserByEmail(userDto.email);
        if (candidate) throw new HttpException("User are present with this E-mail", HttpStatus.BAD_REQUEST);
        const newUser: IResponse = await this.userService.createUser(userDto);
        this.logger.log(`Registered user- ${newUser.detail.user.email}`);
        /*contain auth table */
        const action_token: string = this.generateToken(newUser.detail.user);
        const refreshToken: string = this.generateToken(newUser.detail.user);
        const accessToken: string = this.generateToken(newUser.detail.user);
        const authDataNewUser: Auth = await this.authRepository.create({
            userId: +newUser.detail.user.id,
            refreshToken,
            accessToken,
            action_token
        });

        this.logger.log(`Created tokens for userId- ${authDataNewUser.userId}`);
        return newUser;
    }

    /*async createUserAuth(createUserDto: CreateUserDto): Promise<IResponse> {
        const userFromBd: User = await this.usersRepository.findOneBy({email: createUserDto.email});
        if (userFromBd) throw new HttpException('User exist in bd', HttpStatus.CONFLICT);

        const hashPassword = await bcrypt.hash(createUserDto.password, 5);
        // @ts-ignore
        const newUser: User = this.usersRepository.create({...createUserDto, password: hashPassword});
        // Save the new user to the database
        const createdUser: User = await this.usersRepository.save(newUser);

        const result: IResponse = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": createdUser
            },
            "result": "working"
        }
        this.logger.log(`Created new user- ${createdUser.email}`);
        return result
    }*/

    private generateToken(user: User): string {
        return this.jwtService.sign({email: user.email, id: user.id, firstName: user.firstName, isActive: user.isActive});
    }

    getUserInfo(token: any) {
        const user = this.jwtService.decode(token);
        console.log('getUserInfo!-', user);
        return this.userService.getUserByEmail(user['email']);
    }
}
