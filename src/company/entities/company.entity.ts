import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255, unique: true})
    name: string;

    @Column({type: "varchar", width: 255})
    description: string;
    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => User, user => user.company, {
        onDelete: 'CASCADE',
        eager: true
    })
    @JoinColumn({name: "ownerId"})
    owner: User;

    @OneToMany(() => User, user => user.company)
    members: User[];
}