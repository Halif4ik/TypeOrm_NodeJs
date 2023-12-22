import { MigrationInterface, QueryRunner } from "typeorm";

export class FlowStart1702915347698 implements MigrationInterface {
    name = 'FlowStart1702915347698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passed_quiz" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "targetQuizId" integer, CONSTRAINT "PK_32947e21bebfe3bc0d8dba4ffbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD CONSTRAINT "FK_6832ae627bd3ca33bb2902c1229" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD CONSTRAINT "FK_de1f13530a8fb6d1aa96da0e9e8" FOREIGN KEY ("targetQuizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP CONSTRAINT "FK_de1f13530a8fb6d1aa96da0e9e8"`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP CONSTRAINT "FK_6832ae627bd3ca33bb2902c1229"`);
        await queryRunner.query(`DROP TABLE "passed_quiz"`);
    }

}
