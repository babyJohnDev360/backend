import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins (for development purposes)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Accept', // Specify allowed headers
  });

  // Start the server
  await app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port no. ${process.env.PORT}`);
  });
}

bootstrap();
