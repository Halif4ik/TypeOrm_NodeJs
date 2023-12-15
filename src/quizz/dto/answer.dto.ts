import {IsOptional, IsString, Length} from "class-validator";

export class AnswerDto {
    @IsString({message: 'varAnswer should be string'})
    @Length(4, 500,{ message:'varAnswer Min length 4 max length 500'})
    @IsOptional()
    varAnswer: string;
}

