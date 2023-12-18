import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Quiz} from "./quizz.entity";
import {Answers} from "./answers.entity";
import {PassedQuiz} from "../../work-flow/entities/passedQuiz.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 500})
    questionText: string;

    @Column({type: "varchar", length: 255})
    rightAnswer: string;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToMany(() => Answers, answers => answers.question)
    varsAnswers: Answers[];

    @ManyToOne(() => Quiz, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    quiz: Quiz;

}
