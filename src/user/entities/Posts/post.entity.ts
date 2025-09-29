import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user.entity";

@Entity()
export class Posts{
    @PrimaryGeneratedColumn()
    id:number;

    //Muchos post o publicacines pueden tenerlo un usuario
    @ManyToOne(()=>User,(user)=>user.post)
    @JoinColumn({name:"userId"})
    user:User;

    //No te olvides de ponerle nullabe cuando una columna va a ser opcional el dato
    @Column({length:300,nullable:true})
    description?:string;
    @Column({type:'longtext',nullable:true})
    content?:string;
    @Column({type:"timestamp", default: ()=>'CURRENT_TIMESTAMP'})
    datePublish:Date;
}