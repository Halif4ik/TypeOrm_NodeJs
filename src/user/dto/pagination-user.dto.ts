import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

export class PaginationsDto {
    @IsNumber({}, {message: 'Page should be Number'})
    @IsOptional()
     page?: number;

    @IsBoolean()
    @IsOptional({message: 'revert should be boolean'})
     revert?: boolean;

}
