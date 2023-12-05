import {Transform} from "class-transformer";
import {IsNotEmpty, IsNumber, Min} from "class-validator";

export class AssignRoleDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'userId for AssignRoleDto should be number'})
    @Min(1)
    readonly userId: number;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'companyId for AssignRoleDto should be number'})
    @Min(1)
    readonly companyId: number;
}
