import { Test, TestingModule } from '@nestjs/testing';
import { NotificacaoService } from '../notificacao.service';
import { RabbitMQService } from '../rabbitmq.service';

describe('NotificacaoService', () => {
  let service: NotificacaoService;
  let rabbitMock: Partial<RabbitMQService>;

  beforeEach(async () => {
    rabbitMock = {
      sendToQueue: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacaoService,
        { provide: RabbitMQService, useValue: rabbitMock },
      ],
    }).compile();

    service = module.get<NotificacaoService>(NotificacaoService);
  });

  it('É necessário criar uma notificação e armazenar status PENDENTE', async () => {
    const conteudo = 'Mensagem de teste';
    const result = await service.criarNotificacao(conteudo);

    expect(result).toHaveProperty('mensagemId');
    expect(service.consultarStatus(result.mensagemId)).toBe('PENDENTE');
    expect(rabbitMock.sendToQueue).toHaveBeenCalled();
  });

  it('É nececessário atualizar e consultar status da mensagem', () => {
    const mensagemId = '123';
    service.atualizarStatus(mensagemId, 'PROCESSADO_SUCESSO');
    expect(service.consultarStatus(mensagemId)).toBe('PROCESSADO_SUCESSO');
  });
});
