import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "./question.entity";
import {Company} from "../../company/entities/company.entity";

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 500})
    description: string;

    @Column({type: "int"})
    frequencyInDay: number;

    @DeleteDateColumn()
    deleteAt: Date;

    @OneToMany(() => Question, question => question.quiz)
    questions: Question[];

    @ManyToOne(() => Company, company => company.quiz, {
        onDelete: 'CASCADE',
        eager: true
    })
    @JoinColumn()
    company: Company;
}
