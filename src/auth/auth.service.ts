import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";

@Injectable()
export class AuthService {
    private bcrypt: any;

    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    login(userDto: CreateUserDto) {
    }

    async registration(userDto: CreateUserDto) {
        const candidate:User = await this.userService.getUserByEmail(userDto.email);
        if (candidate) throw new HttpException("User are present with this E-mail", HttpStatus.BAD_REQUEST);
        const hashPassword = await this.bcrypt.hash(userDto.password, 5);
        const user: User = await this.userService.createUser({...userDto, password: hashPassword});
        return this.generateToken(user);
    }

    private generateToken(user: User): { token: string } {
        const payload = {email: user.email, id: user.id, firstName: user.firstName, isActive: user.isActive};
        return {
            token: this.jwtService.sign(payload)
        };
    }
}
