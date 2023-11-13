import { IsString, Length} from "class-validator";

export class DeleteCompanyDto {
    @IsString({message: 'name should be string'})
    @Length(2, 20, {message: ' name Min lenth 2 max length 20'})
    readonly name: string;

}