import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
    DeleteDateColumn,
    JoinColumn, CreateDateColumn
} from 'typeorm';
import {Company} from "../../company/entities/company.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Invite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "boolean",default: false})
    accept: boolean;

    @CreateDateColumn()
    createAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => Company, company => company.invites, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    ownerCompany: Company;

    @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    ownerUser: User;

    @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({name: "targetUser"})
    targetUser: User;

}
