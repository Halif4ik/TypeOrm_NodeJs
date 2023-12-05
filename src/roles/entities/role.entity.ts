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
export enum UserRole {
    ADMIN = "admin",
    GHOST = "ghost",
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GHOST,
    })
    value: UserRole;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => Company, company => company.roles, {onDelete: 'CASCADE'})
    @JoinColumn()
    company: Company;

    @ManyToOne(() => User, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

}




