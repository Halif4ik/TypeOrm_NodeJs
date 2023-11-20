import { IsEmail,  IsString, Length} from "class-validator";
export class LoginUserDto {
    @IsEmail({},{message: 'E-mail, should be string'})
    @Length(3, 255,{ message:' mail Min lenth 3 max length 255'})
    readonly email:string;

    @IsString({message: 'Password should be string'})
    @Length(4, 20,{ message:'Password Min lenth 4 max length 20'})
    readonly password:string;

}
