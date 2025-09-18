import { IsEnum, IsString } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { roles } from "../enums/rol.enum";
import { User } from "./user.entity";

@Entity()
export class Rol{
@PrimaryGeneratedColumn()
id:number

@Column({unique:true})
rol:string

@OneToMany(()=>User,user=>user.rol)
user:User[]
}