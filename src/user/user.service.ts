import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {Repository} from "typeorm";
import {IResponse} from "./entities/responce.interface";
import * as bcrypt from "bcryptjs";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as process from "process";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    }

    findAll(needPage: string, revert: string): Promise<User[]> {
        if (!needPage || isNaN(parseInt(needPage)) || needPage === '0') needPage = "1";
        const needPageParse: number = parseInt(needPage);
        const order = revert === 'true' ? 'ASC' : 'DESC';
        /* console.log('needPage-', needPage);
         console.log('order-', order);*/
        return this.usersRepository.find({
            take: +process.env.PAGE_PAGINATION,
            skip: (needPageParse - 1) * (+process.env.PAGE_PAGINATION),
            order: {
                id: order
            }
        });
    }

    async createUser(user: Partial<User>): Promise<User> {
        const hashPassword = await bcrypt.hash(user.password, 5);
        const newUser = this.usersRepository.create({...user, password: hashPassword});
        // Save the new user to the database
        const createdUser: User = await this.usersRepository.save(newUser);
        return createdUser
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({id});
    }

    async remove(email: string): Promise<User> {
        const userFromBd: User = await this.usersRepository.findOneBy({email: email});
        if (!userFromBd) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return this.usersRepository.remove(userFromBd);
    }

    async update(updateUserDto: UpdateUserDto) {

        const userFromBd: User | null = await this.getUserByEmail(updateUserDto.email);
        if (!userFromBd) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        // Update the user's properties
        userFromBd.firstName = updateUserDto.firstName;
        //if (updateUserDto.email) userFromBd.email = updateUserDto.email;

        const updatedUser: User = await this.usersRepository.save(userFromBd);

        const result: IResponse = {
            "status_code": 200,
            "detail": {
                "user": updatedUser
            },
            "result": "working"
        };
        return result;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({email});
    }
}
