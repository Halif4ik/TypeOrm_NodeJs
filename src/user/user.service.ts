import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {Repository} from "typeorm";
import {IResponse} from "./entities/responce.interface";
import * as bcrypt from "bcryptjs";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async create(user: Partial<User>) {
        const hashPassword = await bcrypt.hash(user.password, 5);
        const newUser = this.usersRepository.create({...user, password: hashPassword});
        // Save the new user to the database
        const createdUser: User = await this.usersRepository.save(newUser);
        return createdUser
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({id});
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async update(updateUserDto: UpdateUserDto) {
        console.log('updateUserDto-', updateUserDto);
        const userFromBd: User = await this.usersRepository.findOneBy({email: updateUserDto.email});
        if (!userFromBd) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
// Update the user's properties
        userFromBd.firstName = updateUserDto.firstName;
        if (updateUserDto.email) {
            userFromBd.email = updateUserDto.email;
        }

        const updatedUser: User = await this.usersRepository.save(userFromBd);
        console.log('updatedUser-', updatedUser);

        const result: IResponse = {
            "status_code": 200,
            "detail": {
                "user": updatedUser
            },
            "result": "working"
        };
        return result;
    }
}
