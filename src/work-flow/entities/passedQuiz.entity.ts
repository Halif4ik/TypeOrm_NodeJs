import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Quiz} from "../../quizz/entities/quizz.entity";
import {Answers} from "../../quizz/entities/answers.entity";
import {AvgRating} from "./averageRating.entity";

@Entity()
export class PassedQuiz {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => User, user => user.passedQuiz, {
        onDelete: 'CASCADE',
        eager: true
    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Quiz, quiz => quiz.passedQuiz, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    targetQuiz: Quiz;

    @ManyToMany(() => Answers)
    @JoinTable()
    rightAnswers: Answers[];

    @ManyToOne(() => AvgRating, avgRating => avgRating.passedQuiz)
    @JoinColumn()
    averageRating: AvgRating;
}
