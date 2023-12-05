import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Quizz} from "./quizz.entity";
import {Answers} from "./answers.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255})
    question: string;

    @Column({type: "varchar", width: 255})
    rightAnswer: string;


    @OneToMany(() => Answers, answers => answers.question)
    varAnswer: Answers[];

    @ManyToOne(() => Quizz, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    quiz: Quizz;

}
