import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteStart1700229296729 implements MigrationInterface {
    name = 'InviteStart1700229296729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invite" ("id" SERIAL NOT NULL, "accept" boolean NOT NULL DEFAULT false, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownerCompanyId" integer, "ownerUserId" integer, "targetUser" integer, CONSTRAINT "REL_27ac22d94841a0bc61833ec305" UNIQUE ("ownerUserId"), CONSTRAINT "REL_1e2a5be7194a728cc18211f89b" UNIQUE ("targetUser"), CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_16eb8964d6c2985c2e4114ec8f1" FOREIGN KEY ("ownerCompanyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_27ac22d94841a0bc61833ec3053" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_1e2a5be7194a728cc18211f89bc" FOREIGN KEY ("targetUser") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_1e2a5be7194a728cc18211f89bc"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_27ac22d94841a0bc61833ec3053"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_16eb8964d6c2985c2e4114ec8f1"`);
        await queryRunner.query(`DROP TABLE "invite"`);
    }

}
