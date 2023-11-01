import {Entity, Column, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import {Auth} from "../../auth/entities/auth.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

   /* @OneToOne(() => Auth)
    auth: Auth;*/

}
