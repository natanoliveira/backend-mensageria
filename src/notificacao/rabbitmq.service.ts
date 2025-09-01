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
            const url = this.configService.get<string>('RABBITMQ_URL');
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
        }
    }

    async assertQueue(queue: string) {
        await this.ensureConnection();
        await this.channel.assertQueue(queue);
    }

    async sendToQueue(queue: string, message: any) {
        await this.ensureConnection();
        await this.channel.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, callback: (msg: amqp.ConsumeMessage) => void) {
        await this.ensureConnection();
        await this.channel.assertQueue(queue);
        this.channel.consume(queue, callback, { noAck: false });
    }

    ack(msg: amqp.ConsumeMessage) {
        this.channel.ack(msg);
    }
}
