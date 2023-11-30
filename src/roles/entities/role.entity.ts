import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Company} from "../../company/entities/company.entity";
import {User} from "../../user/entities/user.entity";
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255})
    value: string;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => Company, company => company.roles, { onDelete: 'CASCADE'})
    @JoinColumn()
    company: Company;

    @ManyToOne(() => User, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

}




