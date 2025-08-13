import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService:JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   
    const request = context.switchToHttp().getRequest<Request>();
   

    const token = request.cookies.token || request.headers.authorization?.split(' ')[1];
    if(!token){
  throw new UnauthorizedException('Token not found');
    }
    try {
      console.log(token);
       const payload =  this.jwtService.verify(token);
       console.log(payload);
       request.user = payload;
       console.log("request in userguard: ",request.user)
       return true;
      
    } catch (error) {
      throw new UnauthorizedException("Invalid token")
    }
  
  }
}
