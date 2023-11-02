import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEmail1698693462692 implements MigrationInterface {
    name = 'UserEmail1698693462692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "lastName" TO "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "email" TO "lastName"`);
    }

}
