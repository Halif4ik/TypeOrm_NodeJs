import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "./question.entity";

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 500})
    description: string;

    @Column({type: "int"})
    frequencyInDay: number;

    @OneToMany(() => Question, question => question.quiz)
    questions: Question[];

}
