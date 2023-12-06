
import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizVasRename1701889842761 implements MigrationInterface {
    name = 'QuizVasRename1701889842761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" SERIAL NOT NULL, "description" character varying(500) NOT NULL, "frequencyInDay" integer NOT NULL, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quizz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
