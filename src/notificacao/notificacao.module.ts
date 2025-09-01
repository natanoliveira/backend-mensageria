/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { NotificacaoController } from './notificacao.controller';
import { ConsumerService } from './consumer.service';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  controllers: [NotificacaoController],
  providers: [NotificacaoService, RabbitMQService, ConsumerService],
})
export class NotificacaoModule { }
