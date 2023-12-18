import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "./question.entity";

@Entity()
export class Answers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 255})
    varAnswer: string;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => Question, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    question: Question;

}
