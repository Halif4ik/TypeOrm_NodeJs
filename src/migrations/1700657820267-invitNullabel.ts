import { MigrationInterface, QueryRunner } from "typeorm";

export class InvitNullabel1700657820267 implements MigrationInterface {
    name = 'InvitNullabel1700657820267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "accept" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "accept" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "accept" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "accept" SET NOT NULL`);
    }

}
