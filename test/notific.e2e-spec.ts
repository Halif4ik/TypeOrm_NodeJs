import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {CreateQuizDto} from "../src/quizz/dto/create-quiz.dto";
import * as dotenv from 'dotenv';
import * as process from "process";
import {ConfigService} from "@nestjs/config";

dotenv.config();
const configService = new ConfigService();
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
   let createdIdForTest: string;

   beforeEach(async (): Promise<void> => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();
      app = moduleFixture.createNestApplication();
      await app.init();
   });


   it('/quiz/create (POST)', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
          .post('/quiz/create')
          .set('Authorization', `Bearer ${process.env.TOKEN_ADMIN_TEST}`)
          .send(quizForTest);

      expect(response.status).toBe(201);
      createdIdForTest = response.body.detail.quiz.id;
      expect(response.body.detail.quiz.id).toBeDefined();
   });

   it('/quiz/all?companyId=1&page=1&revert=false (GET)', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
          .get('/quiz/all?companyId=1&page=1&revert=false')
          .set('Authorization', `Bearer ${process.env.TOKEN_ADMIN_TEST}`);

      expect(response.status).toBe(200);
      expect(response.body.detail.quiz).toHaveLength(+process.env.PAGE_PAGINATION);
      expect(response.body.detail.quiz[0].id).toEqual(createdIdForTest);
   });


   it('/quiz/delete?quizId=41 (DELETE)', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
          .delete(`/quiz/delete?quizId=${createdIdForTest}`)
          .set('Authorization', `Bearer ${configService.get<string>('TOKEN_ADMIN_TEST')}`);
      expect(response.status).toBe(200);
      expect(response.body.detail.quiz).toEqual(createdIdForTest);
   });

   it('/quiz/delete?quizId=41 (DELETE) - FAIL', async (): Promise<void> => {
      const response = await request(app.getHttpServer())
          .delete(`/quiz/delete?quizId=${createdIdForTest}`)
          .set('Authorization', `Bearer ${configService.get<string>('TOKEN_ADMIN_TEST')}`);
      expect(response.status).toBe(401);
      expect(response.body["message"]).toEqual('Quiz not found when we thy authorize user by company');
   });

   afterAll(async (): Promise<void> => {
      await app.close(); // Close the NestJS application after All test suite
   });

});
