import {CreateQuizDto} from './create-quiz.dto';
import {IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min, MinLength, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import {IntersectionType, OmitType, PartialType} from "@nestjs/mapped-types";

/*required Field quizId*/
export class GetRedisQuizDto {
    @Transform(({value}) => {
        if (value.toLowerCase() === 'json' || value.toLowerCase() === 'csv') {
            return value.toLowerCase();
        }
        return '';
    },)
    @IsNotEmpty({message: 'format for exportQuiz should be json or csv'})
    readonly format: string;

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value))
    @IsNotEmpty()
    @IsNumber({}, {message: 'quizId for exportQuiz should be number'})
    @Min(1)
    readonly quizId: number;

}


export class AdditionalUpdateQuizId {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'quizId for UpdateQuiz should be number'})
    @Min(1)
    readonly quizId: number;
}

/*required Field companyId */
export class AdditionalUpdateQuizCompanyId {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'companyId for UpdateQuiz should be number'})
    @Min(1)
    readonly companyId: number;
}

/*all other  Fields not required */
export class UpdateQuizDto extends IntersectionType(AdditionalUpdateQuizId,
    class UpdateCatDto extends OmitType(class UpdateQuizDtoAllParts extends PartialType(CreateQuizDto) {
    }, ['companyId'] as const) {
    },
    AdditionalUpdateQuizCompanyId,
) {
}

