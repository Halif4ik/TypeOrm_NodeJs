import {
    Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany,
    ManyToOne, OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Invite} from "../../invite/entities/invite.entity";
import {Request} from "../../reqests/entities/reqest.entity";
import {Role} from "../../roles/entities/role.entity";
import {Quiz} from "../../quizz/entities/quizz.entity";
import {AvgRating} from "../../work-flow/entities/averageRating.entity";
import {PassedQuiz} from "../../work-flow/entities/passedQuiz.entity";

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

  /*  @OneToMany(() => User, user => user.companyMember)
    members: User[];*/

    @ManyToMany(() => User, user=> user.companyMember)
    @JoinTable()
    members: User[];

    @OneToMany(() => Invite, invite => invite.ownerCompany)
    invites: Invite[];

    @OneToMany(() => Request, request => request.targetCompany)
    requests: Request[];

    @OneToMany(() => Role, role => role.company)
    roles: Role[];

    @OneToMany(() => Quiz, quiz => quiz.company)
    quiz: Quiz[];

    @OneToMany(() => AvgRating, avgRating => avgRating.passedCompany)
    averageRating: PassedQuiz[];
}
