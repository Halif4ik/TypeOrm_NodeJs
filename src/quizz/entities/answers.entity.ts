import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "./question.entity";

@Entity()
export class Answers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 255})
    varAnswer: string;


    @ManyToOne(() => Question, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    question: Question;


}
