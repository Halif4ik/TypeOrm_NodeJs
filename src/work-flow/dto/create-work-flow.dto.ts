import {Transform} from "class-transformer";
import {IsArray, IsNotEmpty, IsNumber, Min} from "class-validator";

export class CreateWorkFlowDto {
    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({}, {message: 'quiz should be number'})
    @Min(1)
    readonly quizId: number;

    @Transform(({value}) => {
        if (!Array.isArray(value)) return '';
        if (value.length < 1) return '';
        try {
            const result = value.map((item: any) => {
                if (isNaN(parseInt(item.id)) || !item.userAnswer) throw new Error('invalid data!')
                return {
                    id: parseInt(item.id),
                    userAnswer: String(item.userAnswer)
                }
            });
            return result;
        } catch (e) {
            return ''
        }
    })
    @IsArray({message: 'questions should be array with objects'})
    readonly questions: [{ id: number, userAnswer: string }];

}
