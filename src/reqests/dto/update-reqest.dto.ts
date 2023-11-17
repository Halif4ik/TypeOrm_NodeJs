import { PartialType } from '@nestjs/mapped-types';
import { CreateReqestDto } from './create-reqest.dto';

export class UpdateReqestDto extends PartialType(CreateReqestDto) {}
