import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

//Este middleware se encarga de validar que exista un token, en el caso que no pues acceso como falso
@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['authorization'];

    if(!token){
      console.log("Entro al middleware");
     return res.status(401).json({access:false});

    }
    console.log(" avanzo al next");
    next();
  }
}
