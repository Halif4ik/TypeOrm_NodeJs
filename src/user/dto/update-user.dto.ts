import {PartialType} from '@nestjs/mapped-types';
import {CreateUserDto} from './create-user.dto';
import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {Transform} from "class-transformer";
import {Company} from "../../company/entities/company.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString({message: 'FirstName should be string'})
    @Length(2, 255, {message: ' firstName Min lenth 2 max length 255'})
    @IsOptional()
    readonly firstName?: string;

    @IsString({message: 'Password should be string'})
    @Length(4, 20, {message: 'Password Min lenth 4 max length 20'})
    @IsOptional()
    readonly password?: string;


    @IsEmail({}, {message: 'E-mail, should be email'})
    readonly email: string;
}
