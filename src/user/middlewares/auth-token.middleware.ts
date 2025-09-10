import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['authorization'];

    if(!token){
      console.log("Entro al middleware");
     return res.status(401).json({access:false});

    }
    console.log("No avanzo al next");
    next();
  }
}
