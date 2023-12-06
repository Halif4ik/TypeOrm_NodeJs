import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuizzDto extends PartialType(CreateQuizDto) {}
