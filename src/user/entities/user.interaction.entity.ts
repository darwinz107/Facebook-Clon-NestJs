import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Interaction{
    @PrimaryGeneratedColumn()
    @IsNumber()
    id:number;

   @ManyToOne(()=>User,(user)=>user.interactionEmisor)
    @IsNumber()
    @IsNotEmpty()
    @JoinColumn({name:'emisorId'})
    emisorId:number;
   
    @ManyToOne(()=>User,(user)=>user.interactionReceptor)
    @IsNumber()
    @IsNotEmpty()
    @JoinColumn({name:'receptorId'})
    receptorId:number;
    @Column()
    @IsString()
    message:string;
    @Column({type:"timestamp",default: ()=>"CURRENT_TIMESTAMP"})
    @IsDate()
    date:Date;

}
