import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

export class PaginationsDto {
    @IsNumber({}, {message: 'Page should be Number'})
    /*@IsString({message: 'Page should be Number'})*/
    @IsOptional()
    readonly page?: number;

    @IsBoolean()
    @IsOptional({message: 'revert should be boolean'})
    readonly revert?: boolean;

}
