
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';



export const User = createParamDecorator(
    
  (data: unknown, context: ExecutionContext) => {
    
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.cookies.token || request.headers.authorization?.split(' ')[1];

    if(token){
        
    }else{
         return null;
    }
   
  },
);
