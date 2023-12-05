import { MigrationInterface, QueryRunner } from "typeorm";

export class AdminRole1701709708093 implements MigrationInterface {
    name = 'AdminRole1701709708093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "value"`);
        await queryRunner.query(`CREATE TYPE "public"."role_value_enum" AS ENUM('admin', 'ghost')`);
        await queryRunner.query(`ALTER TABLE "role" ADD "value" "public"."role_value_enum" NOT NULL DEFAULT 'ghost'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "value"`);
        await queryRunner.query(`DROP TYPE "public"."role_value_enum"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "value" character varying NOT NULL`);
    }

}
