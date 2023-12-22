import { MigrationInterface, QueryRunner } from "typeorm";

export class FlowCreateDate1702922600706 implements MigrationInterface {
    name = 'FlowCreateDate1702922600706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" RENAME COLUMN "date" TO "createDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" RENAME COLUMN "createDate" TO "date"`);
    }

}
