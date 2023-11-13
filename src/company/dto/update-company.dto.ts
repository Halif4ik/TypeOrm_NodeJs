import {IsOptional, IsString, Length} from "class-validator";
import {Optional} from "@nestjs/common";

export class UpdateCompanyDto {
    @IsString({message: 'name should be string'})
    @Length(2, 20, {message: ' name Min lenth 2 max length 20'})
    readonly oldName: string;

    @IsString({message: 'name should be string'})
    @Length(2, 20, {message: ' name Min lenth 2 max length 20'})
    @IsOptional()
    readonly newName?: string;

    @IsString({message: 'description should be string'})
    @Length(4, 255, {message: 'description Min lenth 4 max length 255'})
    @IsOptional()
    readonly description?: string;
}