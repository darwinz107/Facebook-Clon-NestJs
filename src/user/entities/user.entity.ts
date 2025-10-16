import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Login } from "./user.login.entity";
import { Rol } from "./user.rol.entity";
import { Interaction } from "./user.interaction.entity";
import { Posts } from "./Posts/post.entity";
import { Stories } from "./Posts/stories.entity";
import { Likes } from "./Posts/likes.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()

    name: string;

    @Column({ nullable: true })
    cellphone: string;

    @Column({ nullable: true })
    gender: string;

    //Un usuario puede tener un solo login(correo y contra)
    @OneToOne(() => Login, (login) => login.user)

    login: Login
    //Muchos usuarios puede tener solo un rol
    @ManyToOne(() => Rol, (rol) => rol.user)
    @JoinColumn()
    rol: Rol

    //Solo un emisor puede tener muchas interacciones
    @OneToMany(() => Interaction, (interaction) => interaction.emisorId)
    emisor: Interaction[]

    @OneToMany(() => Interaction, (interaction) => interaction.receptorId)
    receptor: Interaction[]

    //Solo un usuario puede tener muchos posts o publicaciones
    @OneToMany(() => Posts, (post) => post.user)
    post: Posts[]

    //Muchas stories pertenecera a un solo , en cambio si fuera manytomany habria una tercera tabla que conecte a ambas por ejemplo usuarios y stories y las conectaria, osea que podria pertencerle a cualqueira.
    @OneToMany(() => Stories, (storie) => storie.user)
    storie: Stories[]

    @OneToMany(()=>Likes,(like)=>like.user)
    like:Likes[]
}