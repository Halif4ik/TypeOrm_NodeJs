import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizDeletedAt1702319443462 implements MigrationInterface {
    name = 'QuizDeletedAt1702319443462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "question" ADD "deleteAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "deleteAt"`);
    }

}
