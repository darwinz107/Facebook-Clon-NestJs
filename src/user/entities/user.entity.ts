import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Login } from "./user.login.entity";
import { Rol } from "./user.rol.entity";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsString()
    @MinLength(10)
    @MaxLength(20)
    @IsNotEmpty()
    cellphone: string;
    
    @Column()
    gender:string;

    

    @OneToOne(()=>Login,(login)=>login.user)
    
    login:Login
    
    @OneToOne(()=>Rol,(rol)=>rol.user)
    @JoinColumn()
    rol:Rol
}