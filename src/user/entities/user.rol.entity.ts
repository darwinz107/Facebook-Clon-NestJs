import { IsEnum, IsString } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { roles } from "../enums/rol.enum";
import { User } from "./user.entity";

@Entity()
export class Rol{
@PrimaryGeneratedColumn()
id:number

@Column({type:"enum",
    enum:roles,
    default:roles.USER
})
@IsEnum(roles)
rol:string

@OneToOne(()=>User,user=>user.rol)
user:User
}