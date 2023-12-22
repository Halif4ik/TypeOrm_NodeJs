import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min} from "class-validator";
import {Transform} from "class-transformer";

export class PaginationsDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNumber({}, {message: 'Page should be Number'})
    @Min(1)
    @IsOptional()
     page?: number;

    @Transform(({value}) => value.toString() === 'true')
    @IsBoolean({message: 'Revert should be boolean'})
    @IsOptional()
     revert?: boolean;

}
