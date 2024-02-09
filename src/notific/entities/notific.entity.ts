import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Notific {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({type: "varchar", length: 500})
   textNotification: string;

   @Column({type: "boolean", nullable: false})
   statusWatched: boolean;

   @Column()
   time: Date;

   @ManyToOne(() => User, (user) => user.notific, {cascade: true,
      onDelete: 'CASCADE'})
   user: User;

}