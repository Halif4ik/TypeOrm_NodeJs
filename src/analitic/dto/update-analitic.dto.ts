import { PartialType } from '@nestjs/mapped-types';
import { CreateAnaliticDto } from './create-analitic.dto';

export class UpdateAnaliticDto extends PartialType(CreateAnaliticDto) {}
