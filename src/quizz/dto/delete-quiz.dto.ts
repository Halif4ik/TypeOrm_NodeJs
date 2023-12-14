import {IsNotEmpty, IsNumber, Min} from "class-validator";
import {Transform} from "class-transformer";

export class DeleteQuizDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({},{message: 'id company for delete should be number'})
    @Min(1)
    readonly quizId: number;

}