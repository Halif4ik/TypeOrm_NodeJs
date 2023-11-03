import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";


@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ type: "varchar", width: 255 , unique: true})
    action_token: string;

    @Column({ type: "varchar", width: 255 })
    refreshToken: string;

    @Column({ type: "varchar", width: 255 })
    accessToken: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    upadateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToOne(() => User, user => user.auth)
    user: User;
}
