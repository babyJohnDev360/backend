import {CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';  
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken'
import { User } from 'src/common/Schema/user.schema';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      @InjectModel(User.name) private userSchema : Model<User>,
      private jwtService: JwtService
      ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException({success: false,message :"404"});
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: "sdng@424"
          }
        );
       console.log(payload,"payload");
       
        const id = new mongoose.Types.ObjectId(payload.id); 
        const isValid = await this.userSchema.findOne({_id:id})
        if(!isValid){
          throw new UnauthorizedException({success:false, message:"UNAUTHORIZED"});
        }

        request['user'] = payload;
      } catch {
        throw new UnauthorizedException({success:false, message:"UNAUTHORIZED"});
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined
    }
  }