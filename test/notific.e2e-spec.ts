import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {CreateQuizDto} from "../src/quizz/dto/create-quiz.dto";
import * as dotenv from 'dotenv';

dotenv.config();
const quizForTest: CreateQuizDto = {
   "description": "TLakes and capitals",
   "frequencyInDay": 777,
   "companyId": 1,
   "questions": [
      {
         "questionText": "capital of Bereg slonovoi kosti",
         "rightAnswer": "Jamusukro",
         "varsAnswers": [
            {"varAnswer": "AdisAbeba"},
            {"varAnswer": "SadisAbeda"},
            {"varAnswer": "Jamusukro"}
         ]
      },
      {
         "questionText": "bigest lake world",
         "rightAnswer": "Kaspiiskoe",
         "varsAnswers": [
            {"varAnswer": "Baikal"},
            {"varAnswer": "Svitiaz"},
            {"varAnswer": "Kaspiiskoe"}
         ]
      }
   ]
}

describe('AppController (e2e)', () => {
   let app: INestApplication;
   let createdId: string;

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
   });
   it('/quiz/create (POST)', async () => {
      const response = await request(app.getHttpServer())
          .post('/quiz/create')
          .set('Authorization', `Bearer ${process.env.TOKEN_ADMIN_TEST}`)
          .send(quizForTest);

      expect(response.status).toBe(201);
      expect(response.body.detail.quiz.id).toBeDefined();
   });

});
