import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Company} from "../../company/entities/company.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "boolean", nullable: true})
    accept: boolean;

    @CreateDateColumn()
    createAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;

    @ManyToOne(() => Company, company => company.requests, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    targetCompany: Company;

    @ManyToOne(() => User, {cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    requestUser: User;

}



