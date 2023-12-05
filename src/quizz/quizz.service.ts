import { Injectable } from '@nestjs/common';
import { CreateQuizzDto } from './dto/create-quizz.dto';
import { UpdateQuizzDto } from './dto/update-quizz.dto';

@Injectable()
export class QuizzService {

  createQuiz(createQuizzDto: CreateQuizzDto) {
    return 'This action adds a new quizz';
  }
}
