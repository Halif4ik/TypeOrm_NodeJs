import { IsNumber, IsOptional, IsString} from "class-validator";

export class PaginationsUserDto  {
    @IsNumber({},{message: 'Page should be Number'})
    @IsOptional()// This decorator allows the property to be optional
    readonly page: number;

    @IsString()
    @IsOptional({message: 'revert should be boolean'})// This decorator allows the property to be optional
    readonly revert: string;

}
