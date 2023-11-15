/*import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';
import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, {metatype}: ArgumentMetadata) {
        console.log('transform-');
        if (!metatype || !this.toValidate(metatype)) {
            console.log('if-', value);
            return value;
        }
        const object = plainToInstance(metatype, value);
        console.log('object-', object);
        const errors = await validate(object);
        console.log('errors-', errors);

        if (errors.length) throw new BadRequestException('Валидация не пройдена');
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}*/
import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);
        console.log('obj-', obj);
        if (errors.length) {
            console.log('if-');

            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`
            })
            throw new BadRequestException('Валидация не пройдена');
        }
        return value;
    }

}
