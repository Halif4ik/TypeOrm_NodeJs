import { MigrationInterface, QueryRunner } from "typeorm";

export class PassedQAvgR1703113672760 implements MigrationInterface {
    name = 'PassedQAvgR1703113672760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP CONSTRAINT "FK_c144b973c90f25dc12c1d01c731"`);
        await queryRunner.query(`CREATE TABLE "avg_rating_passed_quiz_passed_quiz" ("avgRatingId" integer NOT NULL, "passedQuizId" integer NOT NULL, CONSTRAINT "PK_78c2a5f6e36c148c2e891cfac8c" PRIMARY KEY ("avgRatingId", "passedQuizId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_108bd7bf347cf01f7a8f8c283c" ON "avg_rating_passed_quiz_passed_quiz" ("avgRatingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aa295eccd7be7bb20100c807c7" ON "avg_rating_passed_quiz_passed_quiz" ("passedQuizId") `);
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP COLUMN "averageRatingId"`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_quiz" ADD CONSTRAINT "FK_108bd7bf347cf01f7a8f8c283ce" FOREIGN KEY ("avgRatingId") REFERENCES "avg_rating"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_quiz" ADD CONSTRAINT "FK_aa295eccd7be7bb20100c807c7b" FOREIGN KEY ("passedQuizId") REFERENCES "passed_quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_quiz" DROP CONSTRAINT "FK_aa295eccd7be7bb20100c807c7b"`);
        await queryRunner.query(`ALTER TABLE "avg_rating_passed_quiz_passed_quiz" DROP CONSTRAINT "FK_108bd7bf347cf01f7a8f8c283ce"`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD "averageRatingId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa295eccd7be7bb20100c807c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_108bd7bf347cf01f7a8f8c283c"`);
        await queryRunner.query(`DROP TABLE "avg_rating_passed_quiz_passed_quiz"`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD CONSTRAINT "FK_c144b973c90f25dc12c1d01c731" FOREIGN KEY ("averageRatingId") REFERENCES "avg_rating"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
