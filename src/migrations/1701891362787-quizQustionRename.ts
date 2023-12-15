import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizQustionRename1701891362787 implements MigrationInterface {
    name = 'QuizQustionRename1701891362787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME COLUMN "question" TO "questionText"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME COLUMN "questionText" TO "question"`);
    }

}
