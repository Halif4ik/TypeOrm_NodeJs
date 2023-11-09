import {IsString, Length} from "class-validator";

export class CreateCompanyDto {
    @IsString({message: 'name should be string'})
    @Length(2, 20, {message: ' name Min lenth 2 max length 20'})
    readonly name: string;

    @IsString({message: 'description should be string'})
    @Length(4, 255, {message: 'description Min lenth 4 max length 255'})
    readonly description: string;

}
