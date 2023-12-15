import {Transform} from "class-transformer";
import {IsNotEmpty, IsNumber, Min} from "class-validator";

export class CreateWorkFlowDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'quiz should be number'})
    @Min(1)
    readonly quiz: number;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'quiz should be number'})
    @Min(1)
    readonly question: number;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'quiz should be number'})
    @Min(1)
    readonly varAnswer: number;

}
