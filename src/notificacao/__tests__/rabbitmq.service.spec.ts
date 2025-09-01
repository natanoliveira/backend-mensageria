import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from '../rabbitmq.service';
import * as amqp from 'amqplib';

jest.mock('amqplib');

describe('RabbitMQService', () => {
  let service: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMQService],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
  });

  it('deve chamar sendToQueue', async () => {
    const mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    };
    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: () => mockChannel,
    });

    await service.sendToQueue('fila.teste.NatanSousa', { msg: 'ok' });

    expect(mockChannel.assertQueue).toHaveBeenCalledWith(
      'fila.teste.NatanSousa',
    );
    expect(mockChannel.sendToQueue).toHaveBeenCalled();
  });
});
