import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import { HttpResponseFilter } from './filters/http-response.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpResponseFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
