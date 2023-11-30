import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteOwnerUserManyTo1700483487079 implements MigrationInterface {
    name = 'InviteOwnerUserManyTo1700483487079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_27ac22d94841a0bc61833ec3053"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "REL_27ac22d94841a0bc61833ec305"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_27ac22d94841a0bc61833ec3053" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_27ac22d94841a0bc61833ec3053"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "REL_27ac22d94841a0bc61833ec305" UNIQUE ("ownerUserId")`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_27ac22d94841a0bc61833ec3053" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
