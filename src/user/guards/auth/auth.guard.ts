import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { roles } from 'src/user/enums/rol.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private  jwtService:JwtService,
    private  reflector:Reflector
  ){}
  
 canActivate(
    context: ExecutionContext,
  ): boolean {
  console.log("AuthGuard is running");

   const roles = this.reflector.get<roles[]>('roles',context.getHandler());
      
        const request = context.switchToHttp().getRequest() as Request ;
        
        console.log('Cookies:', request.cookies);
        const token = request.cookies.token || request.headers['authorization']?.split(' ')[1];
        if(!token){
          throw new BadRequestException("Token not found");
        };
    try {

     
    const validate =  this.jwtService.verify(token);
    if(!validate){
      throw new BadRequestException("Invalid token");
    }
    console.log(validate.rol);
    return roles.includes(validate.rol);
   
    }
     catch (error) {
       console.log('Error verificando token:', error.message);
  throw new BadRequestException("Invalid token");
    }
  }

}