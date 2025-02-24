import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); 
  await app.listen(process.env.PORT,async ()=>{
    console.log(`Server is running on port no. ${[process.env.PORT]}`);
    
  });
}
bootstrap();
