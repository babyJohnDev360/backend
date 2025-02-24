import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createAccessToken(userInfo) {
    return await this.jwtService.signAsync({id:userInfo._id, role:userInfo.role})
  }
}