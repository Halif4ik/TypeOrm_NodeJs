import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizLenght1701883286454 implements MigrationInterface {
    name = 'QuizLenght1701883286454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "question"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "question" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "rightAnswer"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "rightAnswer" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "varAnswer"`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "varAnswer" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "varAnswer"`);
        await queryRunner.query(`ALTER TABLE "answers" ADD "varAnswer" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "rightAnswer"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "rightAnswer" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "question"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "question" character varying NOT NULL`);
    }

}
