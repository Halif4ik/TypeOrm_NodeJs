import { MigrationInterface, QueryRunner } from "typeorm";

export class ActionTokenUniqUpdatetet1699026991270 implements MigrationInterface {
    name = 'ActionTokenUniqUpdatetet1699026991270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "UQ_9f94b1b80904d8ba606b15bbf51" UNIQUE ("action_token")`);
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "createAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "upadateAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "deleteAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "deleteAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "upadateAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "createAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "UQ_9f94b1b80904d8ba606b15bbf51"`);
    }

}
