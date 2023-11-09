import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {IResponseUser} from "./entities/responce.interface";
import * as bcrypt from "bcryptjs";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as process from "process";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    }

    async findAll(needPage: number, revert: string): Promise<User[]> {
        if (!needPage || isNaN(needPage) || needPage < 0) needPage = 1;
        const order = revert === 'true' ? 'ASC' : 'DESC';
        return this.usersRepository.find({
            take: +process.env.PAGE_PAGINATION,
            skip: (+needPage - 1) * (+process.env.PAGE_PAGINATION),
            order: {
                id: order
            }
        });
    }

    async createUser(createUserDto: CreateUserDto): Promise<IResponseUser> {
        const userFromBd: User = await this.usersRepository.findOneBy({email: createUserDto.email});
        if (userFromBd) throw new HttpException('User exist in bd', HttpStatus.CONFLICT);

        const hashPassword = await bcrypt.hash(createUserDto.password, 5);
        // @ts-ignore
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
        return  this.usersRepository.findOne({
            where: {email}
        });
    }

    async findOne(id: number):Promise<User>{
        const user: User = await this.usersRepository.findOneBy({id});
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        } else {
            const result: User = user;
            return result;
        }
    }

    async remove(email: string): Promise<IResponseUser> {
        const userFromBd: User = await this.usersRepository.findOneBy({email: email});
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

    async update(updateUserDto: UpdateUserDto): Promise<IResponseUser> {
        const userFromBd: User = await this.usersRepository.findOneBy({email: updateUserDto.email});
        if (!userFromBd) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        // Update the user's properties
        userFromBd.firstName = updateUserDto.firstName;
        //if (updateUserDto.email) userFromBd.email = updateUserDto.email;

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
