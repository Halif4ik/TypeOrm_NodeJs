import {isBoolean, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Length, Min} from "class-validator";
import {Transform} from "class-transformer";
export class CreateInviteDto {
    @IsEmail({},{message: 'E-mail should be valid'})
    readonly membersEmail: string;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({},{message: 'id company for delete should be number'})
    @Min(1)
    readonly companyId: number;

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty()
    @IsBoolean({message: 'id company for delete should be number'})
    readonly accept: boolean;

}
