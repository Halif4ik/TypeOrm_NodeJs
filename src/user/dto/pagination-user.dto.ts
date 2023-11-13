import { IsNumber, IsOptional, IsString} from "class-validator";

export class PaginationsDto {
    @IsString({message: 'Page should be Number'})
    @IsOptional()
    readonly page: string;

    @IsString()
    @IsOptional({message: 'revert should be boolean'})
    readonly revert: string;

}
