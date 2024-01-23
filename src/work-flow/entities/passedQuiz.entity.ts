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

@Entity()
export class PassedQuiz {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({type: 'boolean', default: false})
    isStarted: boolean;

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

}
