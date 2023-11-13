import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinColumnSoftUserDel1699521198945 implements MigrationInterface {
    name = 'JoinColumnSoftUserDel1699521198945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "UQ_373ead146f110f04dad60848154" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "UQ_373ead146f110f04dad60848154"`);
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "userId" SET NOT NULL`);
    }

}
