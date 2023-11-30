import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDto } from './create-request.dto';

export class UpdateReqestDto extends PartialType(CreateRequestDto) {}
