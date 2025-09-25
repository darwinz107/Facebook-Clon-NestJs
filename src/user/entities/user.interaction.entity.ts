import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Interaction{
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>User,(user)=>user.emisor,{nullable:false})
    @JoinColumn({name:"emisorId"})
    
    emisorId:User;
    @ManyToOne(()=>User,(user)=>user.receptor,{nullable:false})
    @JoinColumn({name:"receptorId"})  
    receptorId:User;
    @Column({length:800})
    message:string;
    @Column({type:"timestamp", default:()=>"CURRENT_TIMESTAMP"})
    date:Date

    @Column('boolean',{default:false})
    seen:boolean
}