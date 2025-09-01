/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { NotificacaoService } from './notificacao.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
    constructor(
        private readonly rabbit: RabbitMQService,
        private readonly notificacaoService: NotificacaoService,
    ) { }

    async onModuleInit() {
        await this.rabbit.consume(
            this.notificacaoService.getEntradaQueue(),
            async (msg) => {
                try {
                    const content = JSON.parse(msg.content.toString());
                    console.log('Recebido:', content);

                    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

                    const sucesso = Math.floor(Math.random() * 10) > 2;
                    const status = sucesso ? 'PROCESSADO_SUCESSO' : 'FALHA_PROCESSAMENTO';

                    this.notificacaoService.atualizarStatus(content.mensagemId, status);
                    await this.rabbit.sendToQueue(
                        this.notificacaoService.getStatusQueue(),
                        { mensagemId: content.mensagemId, status },
                    );

                    this.rabbit.ack(msg);
                } catch (error) {
                    console.error('Erro ao processar mensagem do RabbitMQ:', error.message);
                    if (msg) this.rabbit.ack(msg);
                }
            },
        );
    }
}