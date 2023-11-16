import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Company} from "../../company/entities/company.entity";

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

    @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    ownerUser: User;

    @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({name: "targetUser"})
    targetUser: User;

}
