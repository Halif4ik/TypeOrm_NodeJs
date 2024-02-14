import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";

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
