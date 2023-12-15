import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationQuizComp1702027591459 implements MigrationInterface {
    name = 'RelationQuizComp1702027591459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD CONSTRAINT "FK_26e0bc32ccf1dcebf73d0ceb77a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_26e0bc32ccf1dcebf73d0ceb77a"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "companyId"`);
    }

}
