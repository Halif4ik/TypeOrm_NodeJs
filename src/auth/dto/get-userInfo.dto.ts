import {  IsOptional, IsString} from "class-validator";

export class UserInfoDto  {
    @IsString()
    @IsOptional({message: 'token should be string'})// This decorator allows the property to be optional
    readonly token: string;

}
