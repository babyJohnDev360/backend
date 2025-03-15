import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*', // Allow all origins (for development purposes)
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
      allowedHeaders: 'Content-Type, Accept, Authorization', // Specify allowed headers
    },
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Start the server
  const port = process.env.PORT || 3000; // Use a default port if the environment variable is not set
  await app.listen(port, async () => {
    console.log(`Server is running on port no. ${port}`);
  });
}

bootstrap();
