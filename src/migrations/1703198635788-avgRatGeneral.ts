import { MigrationInterface, QueryRunner } from "typeorm";

export class AvgRatGeneral1703198635788 implements MigrationInterface {
    name = 'AvgRatGeneral1703198635788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "general_rating" ("id" SERIAL NOT NULL, "ratingInSystem" double precision NOT NULL, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_45103313828dc95f4a44e1d8593" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "general_rating" ADD CONSTRAINT "FK_415f7fd6e2e9f697f7c81900bc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_rating" DROP CONSTRAINT "FK_415f7fd6e2e9f697f7c81900bc2"`);
        await queryRunner.query(`DROP TABLE "general_rating"`);
    }

}
