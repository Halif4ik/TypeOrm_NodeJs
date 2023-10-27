import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1698334468850 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" ALTER COLUMN "title" RENAME TO "name"`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" ALTER COLUMN "name" RENAME TO "title"`,
        )
    }

}
