import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: process.env.ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
   });
   app.use(cookieParser());
   app.use(express.json({limit:'50mb'}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
