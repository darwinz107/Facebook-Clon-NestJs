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
    
    //Aqui un usuario puede dar muchos likes, y por ende muchos likes dados puede tenerlo un usuario
    //viendolo asi lo normal para que una persona pueda aparecer mas de una vez en la otra tabla en este
    //caso en likes, se usar onetomany y manytoone es lo normal para estos casos.
    //En cambio manytomany de por si deben existir las 2 tablas y asi eso lo que hacen es emparejar y
    //lo muestra en otra tabla, espero que te quede claro.
    @OneToMany(()=>Likes,(like)=>like.userId)
    like:Likes[]
}