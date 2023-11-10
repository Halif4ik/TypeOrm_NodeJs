import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository, SelectQueryBuilder} from "typeorm";
import {IResponseUser} from "./entities/responce.interface";
import * as bcrypt from "bcryptjs";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as process from "process";
import {CreateUserDto} from "./dto/create-user.dto";
import passport from "passport";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
                private jwtService: JwtService,) {
    }

    async findAll(needPage: number, revert: string) {
        if (!needPage || isNaN(needPage) || needPage < 0) needPage = 1;
        const order = revert === 'true' ? 'ASC' : 'DESC';

        return this.usersRepository.find({
            take: +process.env.PAGE_PAGINATION,
            skip: (+needPage - 1) * (+process.env.PAGE_PAGINATION),
            order: {
                id: order,
            },
            relations: [
                "auth", // Include the Auth relation
            ],
        });
    }


    async createUser(createUserDto: CreateUserDto): Promise<IResponseUser> {
        const userFromBd: User = await this.usersRepository.findOneBy({email: createUserDto.email});
        if (userFromBd) throw new HttpException('User exist in bd', HttpStatus.CONFLICT);
        const hashPassword: string = await bcrypt.hash(createUserDto.password, 5);

        const newUser: User = this.usersRepository.create({...createUserDto, password: hashPassword});
        // Save the new user to the database
        const createdUser: User = await this.usersRepository.save(newUser);

        const result: IResponseUser = {
            "status_code": HttpStatus.OK,
            "detail": {
                "user": createdUser
            },
            "result": "working"
        }
        this.logger.log(`Created new user- ${createdUser.email}`);
        return result
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: {email},
            relations: ['auth']
        });

    }

    async findOne(id: number): Promise<User> {
        const user: User = await this.usersRepository.findOneBy({id});
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        } else {
            const result: User = user;
            return result;
        }
    }

    async deleteUser(token: string, userData: UpdateUserDto): Promise<IResponseUser> {
        const userFromToken = this.jwtService.decode(token.slice(7));
        if (userData.email !== userFromToken['email']) throw new UnauthorizedException({message: "Incorrect credentials for delete User"});

        const userFromBd: User = await this.usersRepository.findOneBy({email: userData.email});
        if (!userFromBd) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        const removedUserFromBd: User = await this.usersRepository.remove(userFromBd);
        const result: IResponseUser = {
            "status_code": 200,
            "detail": {
                "user": removedUserFromBd
            },
            "result": "working"
        };
        this.logger.log(`Removed  user- ${removedUserFromBd.email}`);
        return result;

    }


    async updateUserInfo(token: string, updateUserDto: UpdateUserDto): Promise<IResponseUser> {
        const userFromToken = this.jwtService.decode(token.slice(7));
        if (updateUserDto.email !== userFromToken['email']) throw new UnauthorizedException({message: "Incorrect credentials for updateUserInfo"});

        const userFromBd: User = await this.usersRepository.findOneBy({email: updateUserDto.email});
        if (!userFromBd) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        // Update the user's properties
        if (updateUserDto.firstName || updateUserDto.password) {
            if (updateUserDto.password) userFromBd.password = await bcrypt.hash(updateUserDto.password, 5);
            if (updateUserDto.firstName) userFromBd.firstName = updateUserDto.firstName;
        } else throw new HttpException('Absent fields firstName or password ', HttpStatus.BAD_REQUEST);

        const updatedUser: User = await this.usersRepository.save(userFromBd);

        const result: IResponseUser = {
            "status_code": 200,
            "detail": {
                "user": updatedUser
            },
            "result": "working"
        };
        this.logger.log(`updated new - ${updatedUser.email}`);
        return result;
    }


}
