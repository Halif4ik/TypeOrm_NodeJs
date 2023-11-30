import { MigrationInterface, QueryRunner } from "typeorm";

export class InvitetargetUserManyToOne1700506523747 implements MigrationInterface {
    name = 'InvitetargetUserManyToOne1700506523747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_1e2a5be7194a728cc18211f89bc"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "REL_1e2a5be7194a728cc18211f89b"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_1e2a5be7194a728cc18211f89bc" FOREIGN KEY ("targetUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_1e2a5be7194a728cc18211f89bc"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "REL_1e2a5be7194a728cc18211f89b" UNIQUE ("targetUser")`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_1e2a5be7194a728cc18211f89bc" FOREIGN KEY ("targetUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
