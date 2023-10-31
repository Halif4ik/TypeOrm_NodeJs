import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    async login(userDto: CreateUserDto): Promise<{ token: string }> {
        const userFromBd: User = await this.userService.getUserByEmail(userDto.email);
        if (!userFromBd) throw new UnauthorizedException({message: "Incorrect E-mail"});

        const passwordCompare = await bcrypt.compare(userDto.password, userFromBd.password);
        if (!passwordCompare) throw new UnauthorizedException({message: "Incorect password"});

        return this.generateToken(userFromBd);
    }

    async registration(userDto: CreateUserDto): Promise<{ token: string }> {
        const candidate: User = await this.userService.getUserByEmail(userDto.email);
        if (candidate) throw new HttpException("User are present with this E-mail", HttpStatus.BAD_REQUEST);
        const user: User = await this.userService.createUser(userDto);
        return this.generateToken(user);
    }

    private generateToken(user: User): { token: string } {
        const payload = {email: user.email, id: user.id, firstName: user.firstName, isActive: user.isActive};
        return {
            token: this.jwtService.sign(payload)
        };
    }
}
