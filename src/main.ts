/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import moment from 'moment-timezone';
import morgan from 'morgan';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  console.log(env);
  const defaultPort = 3000;
  const port = process.env.PORT || defaultPort;
  const timezone = process.env.TIMEZONE || 'America/Sao_Paulo';
  const project = process.env.PROJECT;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    origin: true,
  });

  app.use(
    morgan((tokens, req, res) => {
      const dateTime = moment()
        .tz(timezone || 'America/Sao_Paulo')
        .format('DD/MM/YYYY HH:mm:ss');

      return [
        `[REQ ${project}]`,
        dateTime,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }),
  );

  if (env !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Mensageria - Natan Sousa')
      .setDescription('API de mensagens')
      .setVersion('0.0.1')
      .addServer(`http://localhost:${port}`, 'Local')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('documentation', app, document);
  }

  // await app.listen(port);
  await app.listen(port, () => {
    const logger = new Logger();
    logger.log(`\n+-------------------------------------------------------------------------------------+
  🚀  Servidor rodando com sucesso!
  📡  API disponível em: http://localhost:${port}
  🕒  Hora de iniciar os testes!
+-------------------------------------------------------------------------------------+`);
  });
}
bootstrap();
