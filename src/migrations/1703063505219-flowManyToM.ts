import { MigrationInterface, QueryRunner } from "typeorm";

export class FlowManyToM1703063505219 implements MigrationInterface {
    name = 'FlowManyToM1703063505219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passed_quiz_right_answers_answers" ("passedQuizId" integer NOT NULL, "answersId" integer NOT NULL, CONSTRAINT "PK_052645e919cb5e30e164af06665" PRIMARY KEY ("passedQuizId", "answersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_23d2b36c7f62b0e166572b0821" ON "passed_quiz_right_answers_answers" ("passedQuizId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c1537147b92935dcdfb002a19" ON "passed_quiz_right_answers_answers" ("answersId") `);
        await queryRunner.query(`ALTER TABLE "passed_quiz_right_answers_answers" ADD CONSTRAINT "FK_23d2b36c7f62b0e166572b08214" FOREIGN KEY ("passedQuizId") REFERENCES "passed_quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "passed_quiz_right_answers_answers" ADD CONSTRAINT "FK_1c1537147b92935dcdfb002a194" FOREIGN KEY ("answersId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz_right_answers_answers" DROP CONSTRAINT "FK_1c1537147b92935dcdfb002a194"`);
        await queryRunner.query(`ALTER TABLE "passed_quiz_right_answers_answers" DROP CONSTRAINT "FK_23d2b36c7f62b0e166572b08214"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c1537147b92935dcdfb002a19"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23d2b36c7f62b0e166572b0821"`);
        await queryRunner.query(`DROP TABLE "passed_quiz_right_answers_answers"`);
    }

}
