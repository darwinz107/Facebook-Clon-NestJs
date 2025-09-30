import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user.entity";

@Entity({name:"Stories"})
export class Stories{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"longtext",nullable:false})
    content:string;
    @ManyToOne(()=>User,(user)=>user.storie)
    user:User;
    @Column({type:"timestamp",default:()=>"CURRENT_TIMESTAMP"})
    datePublish:Date;
}