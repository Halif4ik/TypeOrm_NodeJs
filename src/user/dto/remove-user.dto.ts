import { IsEmail} from "class-validator";
export class RemoveUserDto {
    @IsEmail({},{message: 'E-mail, should be string'})
    readonly email:string;

}
