import {PartialType} from '@nestjs/mapped-types';
import {CreateUserDto} from './create-user.dto';
import {IsEmail, IsString, Length} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString({message: 'FirstName should be string'})
    @Length(2, 255,{ message:' firstName Min lenth 2 max length 255'})
    readonly firstName: string;

    @IsEmail({},{message: 'E-mail, should be string'})
    readonly email: string;
}
