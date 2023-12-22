import { MigrationInterface, QueryRunner } from "typeorm";

export class AvgRatAll1703170418314 implements MigrationInterface {
    name = 'AvgRatAll1703170418314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avg_rating" RENAME COLUMN "ratingInsideCompany" TO "ratingInSystem"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avg_rating" RENAME COLUMN "ratingInSystem" TO "ratingInsideCompany"`);
    }

}
