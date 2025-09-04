import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Login } from "./user.login.entity";
import { Rol } from "./user.rol.entity";
import { Interaction } from "./user.interaction.entity";

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

    @OneToMany(()=>Interaction,interaction=>interaction.emisorId)
    interactionEmisor:Interaction

    @OneToMany(()=>Interaction,interaction => interaction.receptorId)
    interactionReceptor:Interaction
}