import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Login } from './user/entities/user.login.entity';
import { UserModule } from './user/user.module';


@Module({
  
  imports: [ 
  
    ConfigModule.forRoot({
      isGlobal:true
    }),
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_MYSQL,
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
