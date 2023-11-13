import {Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn} from 'typeorm';
import {Auth} from "../../auth/entities/auth.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255})
    firstName: string;

    @Column({type: "varchar", width: 255, unique: true})
    email: string;

    @Column({type: "varchar", width: 20})
    password: string;

    @Column({default: true})
    isActive: boolean;

    @OneToOne(() => Auth, auth => auth.user,
        {onDelete: 'CASCADE', cascade: true})
    auth: Auth;
}
