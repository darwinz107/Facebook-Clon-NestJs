import { IsEmail, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Login{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    @IsEmail()
    email:string;

    @Column()
    @MinLength(8)
    password:string

    @OneToOne(()=> User, (user) => user.login)
    @JoinColumn()
    user:User

}