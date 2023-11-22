import { IsNotEmpty, IsNumber, Min} from "class-validator";
import {Transform} from "class-transformer";

export class CancelRequestDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({},{message: 'id request for delete should be number'})
    @Min(1)
    readonly requestId: number;


}
