/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    constructor(private configService: ConfigService) { }

    private async ensureConnection() {
        if (!this.channel) {
            const url = this.configService.get<string>('URL_RABBITMQ');
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
        }
    }

    async assertQueue(queue: string) {
        await this.ensureConnection();
        await this.channel.assertQueue(queue);
    }

    async sendToQueue(queue: string, message: any) {
        try {
            await this.ensureConnection();
            await this.channel.assertQueue(queue);
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(`Erro ao enviar mensagem para a fila ${queue}:`, error.message);
            throw error;
        }
    }

    async consume(queue: string, callback: (msg: amqp.ConsumeMessage) => void) {
        try {
            await this.ensureConnection();
            await this.channel.assertQueue(queue);
            this.channel.consume(queue, callback, { noAck: false });
        } catch (error) {
            console.error(`Erro ao consumir fila ${queue}:`, error.message);
        }
    }

    ack(msg: amqp.ConsumeMessage) {
        this.channel.ack(msg);
    }
}
