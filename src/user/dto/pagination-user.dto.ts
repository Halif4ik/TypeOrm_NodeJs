import {IsBoolean, IsNumber, IsOptional, Min} from "class-validator";

export class PaginationsDto {
    @IsNumber({}, {message: 'Page should be Number'})
    @Min(1)
    @IsOptional()
    readonly page?: number;

    @IsBoolean()
    @IsOptional({message: 'revert should be boolean'})
    readonly revert?: boolean;

}
