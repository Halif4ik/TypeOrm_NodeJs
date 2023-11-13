import {Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToOne} from 'typeorm';
import {Auth} from "../../auth/entities/auth.entity";
import {Company} from "../../company/entities/company.entity";

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

    @OneToOne(() => Auth, auth => auth.user)
    auth: Auth;

    @OneToMany(() => Company, company => company.owner)
    company: Company[];

    @ManyToOne(() => Company, company => company.members,{onDelete: 'CASCADE'})
    companyMember: Company;


}
