import {IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min, ValidateNested} from "class-validator";
import {AnswerDto} from "./answer.dto";
import {Type} from "class-transformer";

export class QuestionDto {
    @IsString({message: 'Question should be string'})
    @IsNotEmpty()
    @Length(4, 500,{ message:'Question Min length 4 max length 500'})
    questionText: string;

    @IsString({message: 'rightAnswer should be string'})
    @IsNotEmpty()
    @Length(2, 255,{ message:'rightAnswer Min length 2 max length 255'})
    rightAnswer: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    varsAnswers: AnswerDto[];
}

