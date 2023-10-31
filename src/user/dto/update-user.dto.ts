import {PartialType} from '@nestjs/mapped-types';
import {CreateUserDto} from './create-user.dto';
import {IsEmail, IsOptional, IsString, Length} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    readonly firstName: string;

    @IsString()
    // @IsOptional()// This decorator allows the property to be optional
    readonly email: string;
}
