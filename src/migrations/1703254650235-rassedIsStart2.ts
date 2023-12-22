import { MigrationInterface, QueryRunner } from "typeorm";

export class RassedIsStart21703254650235 implements MigrationInterface {
    name = 'RassedIsStart21703254650235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD "isStarted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP COLUMN "isStarted"`);
    }

}
