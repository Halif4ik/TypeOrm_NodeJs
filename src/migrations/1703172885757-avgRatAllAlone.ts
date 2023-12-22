import { MigrationInterface, QueryRunner } from "typeorm";

export class AvgRatAllAlone1703172885757 implements MigrationInterface {
    name = 'AvgRatAllAlone1703172885757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avg_rating_all" ("id" SERIAL NOT NULL, "ratingInSystem" double precision NOT NULL, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_03904bda40a3b7754febdbec1ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "avg_rating" DROP COLUMN "ratingInSystem"`);
        await queryRunner.query(`ALTER TABLE "avg_rating_all" ADD CONSTRAINT "FK_65b1679bff314d9d87a9ac38777" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avg_rating_all" DROP CONSTRAINT "FK_65b1679bff314d9d87a9ac38777"`);
        await queryRunner.query(`ALTER TABLE "avg_rating" ADD "ratingInSystem" double precision NOT NULL`);
        await queryRunner.query(`DROP TABLE "avg_rating_all"`);
    }

}
