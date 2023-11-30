import { MigrationInterface, QueryRunner } from "typeorm";

export class RequestAddRelations1700691851357 implements MigrationInterface {
    name = 'RequestAddRelations1700691851357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request" ("id" SERIAL NOT NULL, "accept" boolean, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "targetCompanyId" integer, "requestUserId" integer, CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_935e3abf47313bd8ff6def8e025" FOREIGN KEY ("targetCompanyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_400caebccf84cc7dceb20c09b5e" FOREIGN KEY ("requestUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_400caebccf84cc7dceb20c09b5e"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_935e3abf47313bd8ff6def8e025"`);
        await queryRunner.query(`DROP TABLE "request"`);
    }

}
