import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPassword1698745706871 implements MigrationInterface {
    name = 'UserPassword1698745706871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
