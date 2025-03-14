import * as dotenv from 'dotenv'
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
 dotenv.config()

@Module({
 imports: [MongooseModule.forRoot(process.env.MONGODB_URL),UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
