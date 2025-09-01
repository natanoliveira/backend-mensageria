/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificacaoService {
  private readonly entradaQueue = 'fila.notificacao.entrada.NatanSousa';
  private readonly statusQueue = 'fila.notificacao.status.NatanSousa';
  private readonly mensagens = new Map<string, string>();

  constructor(private readonly rabbit: RabbitMQService) { }

  async criarNotificacao(conteudoMensagem: string) {
    const mensagemId = uuidv4();
    const payload = { mensagemId, conteudoMensagem };

    await this.rabbit.sendToQueue(this.entradaQueue, payload);
    this.mensagens.set(mensagemId, 'PENDENTE');

    return { mensagemId };
  }

  atualizarStatus(mensagemId: string, status: string) {
    this.mensagens.set(mensagemId, status);
  }

  consultarStatus(mensagemId: string) {
    return this.mensagens.get(mensagemId) || 'DESCONHECIDO';
  }

  getStatusQueue() {
    return this.statusQueue;
  }

  getEntradaQueue() {
    return this.entradaQueue;
  }
}
