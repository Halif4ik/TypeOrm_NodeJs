import {IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {Optional} from "@nestjs/common";
import {Transform} from "class-transformer";

export class DeleteUserDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'Page should be Number more 1'})
    @Min(1)
    readonly userId: number;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'Page should be Number more 1'})
    @Min(1)
    readonly companyId: number;


}