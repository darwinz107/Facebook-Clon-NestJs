import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user.entity";
import { Likes } from "./likes.entity";

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
    @OneToMany(()=>Likes,(like)=>like.PostId)
    like:Likes[]
}