import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";


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

    /*@OneToOne(() => User)
    user: User;*/
}
