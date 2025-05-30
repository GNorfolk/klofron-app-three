import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.enableVersioning();
  app.enableCors({
    origin: [
      'https://www.klofron.uk',
      'https://old.klofron.uk',
      'https://amplify.klofron.uk'
    ]
  });
  await app.listen(5000);
}
bootstrap();
