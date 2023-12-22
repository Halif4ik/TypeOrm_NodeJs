import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable,
    ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Quiz} from "../../quizz/entities/quizz.entity";
import {Answers} from "../../quizz/entities/answers.entity";
import {Company} from "../../company/entities/company.entity";
import {PassedQuiz} from "./passedQuiz.entity";

@Entity()
export class GeneralRating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float"})
    ratingInSystem: number;

    @ManyToOne(() => User, user => user.averageRating, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: User;

    @UpdateDateColumn()
    updateAt: Date;

}
