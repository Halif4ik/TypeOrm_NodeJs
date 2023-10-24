import { PartialType } from '@nestjs/mapped-types';
import { CreateTestikDto } from './create-testik.dto';

export class UpdateTestikDto extends PartialType(CreateTestikDto) {}
