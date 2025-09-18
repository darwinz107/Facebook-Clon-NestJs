import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Login } from './user/entities/user.login.entity';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  
  imports: [ 
  
    ConfigModule.forRoot({
      isGlobal:true
    }),
    JwtModule.register({
      global:true,
      secret:process.env.SECRET,
      signOptions:{expiresIn:'1h'}
    }),
    
    TypeOrmModule.forRoot({
      /*type: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.DB_PORT ||"3306",10) ,
      username: process.env.USER,
      password: process.env.PASS,
      database: process.env.DB,*/
      url:process.env.DB_URL,
      entities: [],
      autoLoadEntities: true,
      synchronize:true
    }),
    UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
