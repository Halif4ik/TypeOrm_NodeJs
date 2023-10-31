import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    action_token: string;

    @Column()
    refreshToken: string;

    @Column()
    accessToken: string;

    @Column()
    createAt: Date;

    @Column()
    upadateAt: Date;

    @Column()
    deleteAt: Date;
}
