import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOnDeleteInUserJoinColumn1699624275357 implements MigrationInterface {
    name = 'CascadeOnDeleteInUserJoinColumn1699624275357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "authId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6" UNIQUE ("authId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ad5065ee18a722baaa932d1c3c6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authId"`);
    }

}
