import {IsNotEmpty, IsNumber,    Min} from "class-validator";
import {Transform} from "class-transformer";

export class RemoveMembershipDto {

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'Company Id should be Number more 1'})
    @Min(1)
    readonly companyId: number;


}