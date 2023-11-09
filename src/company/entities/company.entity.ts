import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";


@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255, unique: true})
    name: string;

    @Column({type: "varchar", width: 255})
    description: string;

    @ManyToOne(() => User, user => user.company)
    @JoinColumn({name: "ownerId"})
    owner: User;

    @OneToMany(() => User, user => user.company,{onDelete: 'CASCADE'})
    @JoinColumn({name: "memberId"})
    members: User[];
}