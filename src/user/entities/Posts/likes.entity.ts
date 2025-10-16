import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user.entity";
import { Posts } from "./post.entity";

@Entity({name:"Like"})
export class Likes
{
  @PrimaryGeneratedColumn()  
  id:number;
  @ManyToOne(()=>User,(user)=>user.like)
  @JoinColumn({name:"userId"})
  userId:User;
  @ManyToOne(()=>Posts,(posts)=>posts.like)
  @JoinColumn({name:"PostId"})
  PostId:Posts;
  @Column({type:"timestamp",default:()=>"CURRENT_TIMESTAMP"})
  date:Date;
} 