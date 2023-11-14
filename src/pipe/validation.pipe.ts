import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, ParseBoolPipe, ParseIntPipe } from '@nestjs/common';
import {PaginationsDto} from "../user/dto/pagination-user.dto";

@Injectable()
export class ParsePageAndRevertPipe implements PipeTransform<string, PaginationsDto> {
    async transform(value: string, metadata: ArgumentMetadata): Promise<PaginationsDto> {
        const [pageStr, revertStr] = value.split(',');

        const page = await new ParseIntPipe().transform(pageStr, {type: 'query', metatype: Number});
        const revert = await new ParseBoolPipe().transform(revertStr, {type: 'query', metatype: Boolean});

        if (page === undefined || revert === undefined) {
            throw new BadRequestException('Invalid page or revert values');
        }

        return {page, revert} ;
    }
}
