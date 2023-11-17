import {Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToOne, DeleteDateColumn} from 'typeorm';
import {Auth} from "../../auth/entities/auth.entity";
import {Company} from "../../company/entities/company.entity";
import {Invite} from "../../invite/entities/invite.entity";

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

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToOne(() => Auth, auth => auth.user)
    auth: Auth;

   /* @OneToOne(() => Invite, invite => invite.ownerUser)
    invite: Invite;*/

    /*@OneToOne(() => Invite, invite => invite.targetUser)
    targetForInvite: Invite;*/

    @OneToMany(() => Company, company => company.owner)
    company: Company[];

    @ManyToOne(() => Company, company => company.members,{onDelete: 'CASCADE'})
    companyMember: Company;


}
