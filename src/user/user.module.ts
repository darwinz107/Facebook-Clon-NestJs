import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Login } from './entities/user.login.entity';
import { Rol } from './entities/user.rol.entity';
import { Interaction } from './entities/user.interaction.entity';
import { AuthTokenMiddleware } from './middlewares/auth-token.middleware';
import { Posts } from './entities/Posts/post.entity';
import { Stories } from './entities/Posts/stories.entity';
import { Likes } from './entities/Posts/likes.entity';
import { Comment } from './entities/Posts/comments.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Login,Rol,Interaction,Posts,Stories,Likes,Comment])],
  controllers: [UserController],
  providers: [UserService],
})
//Esta clase se encarga de ejecutar el middleware que cree
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    //Aqui especifico el middleware que usare
    .apply(AuthTokenMiddleware)
    //Aca pongo la ruta y el metodo al que quiero que este se direccione, en este caso no se ejecuta
    //ya que la ruta user/token no existe
    .forRoutes({path:"user/token",method:RequestMethod.GET})
  }
}
