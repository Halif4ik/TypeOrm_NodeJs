import {isBoolean, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min} from "class-validator";
import {Transform} from "class-transformer";
export class CreateOrDelInviteDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({},{message: 'User id  for delete should be number'})
    @Min(1)
    readonly userId: number;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({},{message: 'id company for create should be number'})
    @Min(1)
    readonly companyId: number;


}
