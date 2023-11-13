import {IsBoolean, IsEmail, IsOptional, IsString, Length} from "class-validator";
export class CreateUserDto {
    @IsEmail({},{message: 'E-mail, should be string'})
    @Length(3, 255,{ message:' mail Min lenth 3 max length 255'})
    readonly email:string;

    @IsString({message: 'Password should be string'})
    @Length(4, 20,{ message:'Password Min lenth 4 max length 20'})
    readonly password:string;

    @IsString({message: 'FirstName should be string'})
    @Length(2, 255,{ message:' firstName Min lenth 2 max length 255'})
    readonly firstName:string;

    @IsBoolean({message: 'isActive should be boolean true/false'})
    @Length(2, 255,{ message:'isActive true/false'})
    @IsOptional()
    readonly isActive?:boolean;

}
