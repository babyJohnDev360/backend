import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
 // imports: [MongooseModule.forRoot(process.env.MONGODB_URL),UserModule],
  imports: [MongooseModule.forRoot("mongodb+srv://babyjohndev360:bf1vUqEJ6ikoHK3r@cluster0.tegwg.mongodb.net/s"),UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
