import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();
  app.enableCors({
    origin: [
      'https://www.klofron.uk',
      'https://old.klofron.uk'
    ]
  });
  await app.listen(5000);
}
bootstrap();
