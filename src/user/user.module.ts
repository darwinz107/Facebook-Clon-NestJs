import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Login } from './entities/user.login.entity';
import { Rol } from './entities/user.rol.entity';
import { Interaction } from './entities/user.interaction.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Login,Rol,Interaction])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
