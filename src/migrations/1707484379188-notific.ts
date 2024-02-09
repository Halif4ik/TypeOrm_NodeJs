import { MigrationInterface, QueryRunner } from "typeorm";

export class Notific1707484379188 implements MigrationInterface {
    name = 'Notific1707484379188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notific" ("id" SERIAL NOT NULL, "textNotification" character varying(500) NOT NULL, "statusWatched" boolean NOT NULL, "time" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_412cbfd5f269c7701ed1d1f8a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notific" ADD CONSTRAINT "FK_498fe18fded7646b1f1a11e36e8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notific" DROP CONSTRAINT "FK_498fe18fded7646b1f1a11e36e8"`);
        await queryRunner.query(`DROP TABLE "notific"`);
    }

}
