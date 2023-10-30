import { IsEmail, IsString, Length } from "class-validator";
export class CreateUserDto {

    @IsEmail({},{message: 'E-mail, should be string'})
    readonly email:string;

    @IsString({message: 'It should be string'})
    @Length(4, 10,{ message:'Min lenth 4 max length 10'})
    readonly password:string;
}
