import { MigrationInterface, QueryRunner } from "typeorm";

export class FlowPassdAvgRate1703103216816 implements MigrationInterface {
    name = 'FlowPassdAvgRate1703103216816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD "averageRatingId" integer`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" ADD CONSTRAINT "FK_c144b973c90f25dc12c1d01c731" FOREIGN KEY ("averageRatingId") REFERENCES "avg_rating"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP CONSTRAINT "FK_c144b973c90f25dc12c1d01c731"`);
        await queryRunner.query(`ALTER TABLE "passed_quiz" DROP COLUMN "averageRatingId"`);
    }

}
