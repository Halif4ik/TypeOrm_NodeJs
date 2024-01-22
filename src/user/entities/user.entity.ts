import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
    DeleteDateColumn,
    ManyToMany
} from 'typeorm';
import {Auth} from "../../auth/entities/auth.entity";
import {Company} from "../../company/entities/company.entity";
import {Invite} from "../../invite/entities/invite.entity";
import {Request} from "../../reqests/entities/reqest.entity";
import {Role} from "../../roles/entities/role.entity";
import {PassedQuiz} from "../../work-flow/entities/passedQuiz.entity";
import {AvgRating} from "../../work-flow/entities/averageRating.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255})
    firstName: string;

    @Column({type: "varchar", width: 255, unique: true})
    email: string;
    /*, select: false */
    @Column({type: "varchar", width: 20})
    password: string;

    @Column({default: true})
    isActive: boolean;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToOne(() => Auth, auth => auth.user)
    auth: Auth;

    @OneToMany(() => Invite, invite => invite.ownerUser)
    invite: Invite[];

    @OneToMany(() => Invite, invite => invite.targetUser)
    targetForInvite: Invite[];

    @OneToMany(() => Company, company => company.owner)
    company: Company[];

    /*@ManyToOne(() => Company, company => company.members, {onDelete: 'CASCADE'})
    companyMember: Company;*/
    @ManyToMany(() => Company, company => company.members)
    companyMember: Company[]

    @OneToMany(() => Request, request => request.requestUser)
    requests: Request[];

    @OneToMany(() => Role, role => role.user)
    roles: Role[];

    @OneToMany(() => PassedQuiz, passedQuiz => passedQuiz.user)
    passedQuiz: PassedQuiz[];

    @OneToMany(() => AvgRating, avgRating => avgRating.user)
    averageRating: PassedQuiz[];


}
