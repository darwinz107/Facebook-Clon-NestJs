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

@Module({
  imports:[TypeOrmModule.forFeature([User,Login,Rol,Interaction,Posts,Stories,Likes])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthTokenMiddleware)
    .forRoutes({path:"user/token",method:RequestMethod.GET})
  }
}
