import { MigrationInterface, QueryRunner } from "typeorm";

export class SoftDelCompUser1700061346706 implements MigrationInterface {
    name = 'SoftDelCompUser1700061346706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "deleteAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleteAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleteAt"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "deleteAt"`);
    }

}
