import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyUserManyCompany1705943998355 implements MigrationInterface {
    name = 'ManyUserManyCompany1705943998355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_12259f648056f69cea239353dfb"`);
        await queryRunner.query(`CREATE TABLE "company_members_user" ("companyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_8749848c8d0e5d6876369f90a1a" PRIMARY KEY ("companyId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bfa47928743d2f9a809fcb5e0e" ON "company_members_user" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_104295b816e1a1a17d5fbadc71" ON "company_members_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "companyMemberId"`);
        await queryRunner.query(`ALTER TABLE "company_members_user" ADD CONSTRAINT "FK_bfa47928743d2f9a809fcb5e0e8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "company_members_user" ADD CONSTRAINT "FK_104295b816e1a1a17d5fbadc71a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_members_user" DROP CONSTRAINT "FK_104295b816e1a1a17d5fbadc71a"`);
        await queryRunner.query(`ALTER TABLE "company_members_user" DROP CONSTRAINT "FK_bfa47928743d2f9a809fcb5e0e8"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "companyMemberId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_104295b816e1a1a17d5fbadc71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfa47928743d2f9a809fcb5e0e"`);
        await queryRunner.query(`DROP TABLE "company_members_user"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_12259f648056f69cea239353dfb" FOREIGN KEY ("companyMemberId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
