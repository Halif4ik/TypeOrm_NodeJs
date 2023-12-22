import { MigrationInterface, QueryRunner } from "typeorm";

export class FlowAvgRating1703086396793 implements MigrationInterface {
    name = 'FlowAvgRating1703086396793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avg_rating" ("id" SERIAL NOT NULL, "averageRating" double precision NOT NULL, "ratingInsideCompany" double precision NOT NULL, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "passedCompanyId" integer, CONSTRAINT "PK_0c620db43ff4bf44808fe0e55a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "avg_rating" ADD CONSTRAINT "FK_a75766a06bb5b1d5a90ff3b813d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "avg_rating" ADD CONSTRAINT "FK_746e0b7916e4f5064217a96f4f3" FOREIGN KEY ("passedCompanyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avg_rating" DROP CONSTRAINT "FK_746e0b7916e4f5064217a96f4f3"`);
        await queryRunner.query(`ALTER TABLE "avg_rating" DROP CONSTRAINT "FK_a75766a06bb5b1d5a90ff3b813d"`);
        await queryRunner.query(`DROP TABLE "avg_rating"`);
    }

}
