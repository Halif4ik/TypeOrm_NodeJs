import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAuthOneToMany1698939301670 implements MigrationInterface {
    name = 'UserAuthOneToMany1698939301670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "action_token" character varying NOT NULL, "refreshToken" character varying NOT NULL, "accessToken" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL, "upadateAt" TIMESTAMP NOT NULL, "deleteAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
