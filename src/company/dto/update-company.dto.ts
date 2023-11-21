import {IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {Optional} from "@nestjs/common";
import {Transform} from "class-transformer";

export class UpdateCompanyDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'Page should be Number more 1'})
    @Min(1)
     readonly id: number;

    @IsString({message: 'name should be string'})
    @Length(2, 20, {message: ' name Min lenth 2 max length 20'})
    @IsOptional()
    readonly name?: string;

    @IsString({message: 'description should be string'})
    @Length(4, 255, {message: 'description Min lenth 4 max length 255'})
    @IsOptional()
    readonly description?: string;
}