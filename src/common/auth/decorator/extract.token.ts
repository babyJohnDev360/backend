import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const ExtractUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization.split(' ')[1];
    
    const decode : any = jwt.decode(token);

    console.log("Id --> ", decode.id)
    
    const userId = decode.id;
    console.log(userId,"userId");
    return userId;
  },  
);  
