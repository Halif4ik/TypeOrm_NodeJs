// ParsePageAndRevertPipe
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    ParseBoolPipe,
    ParseIntPipe
} from '@nestjs/common';
import {PaginationsDto} from '../user/dto/pagination-user.dto';

@Injectable()
export class ParsePageAndRevertPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<PaginationsDto> {
        const paginationsDto: PaginationsDto = {};

        if (value.page) {
            paginationsDto['page'] = await new ParseIntPipe().transform(value.page, {type: 'query', metatype: Number});
        }

        if (value.revert) {
            paginationsDto.revert = await new ParseBoolPipe().transform(value.revert, {
                type: 'query',
                metatype: Boolean
            });
        }
        /*todo hz when it will work*/
        if (Object.values(paginationsDto).some((param) => param === undefined)) {
            throw new BadRequestException('Invalid query parameters');
        }

        return paginationsDto;
    }
}
