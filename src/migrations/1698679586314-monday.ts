import { MigrationInterface, QueryRunner } from "typeorm";

export class Monday1698679586314 implements MigrationInterface {
    name = 'Monday1698679586314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "action_token" character varying NOT NULL, "refreshToken" character varying NOT NULL, "accessToken" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL, "upadateAt" TIMESTAMP NOT NULL, "deleteAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
