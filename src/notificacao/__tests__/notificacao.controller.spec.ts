import { Test, TestingModule } from '@nestjs/testing';
import { NotificacaoController } from '../notificacao.controller';
import { NotificacaoService } from '../notificacao.service';
import { BadRequestException } from '@nestjs/common';

describe('NotificacaoController', () => {
  let controller: NotificacaoController;
  let serviceMock: Partial<NotificacaoService>;

  beforeEach(async () => {
    serviceMock = {
      criarNotificacao: jest.fn().mockResolvedValue({ mensagemId: 'uuid123' }),
      consultarStatus: jest.fn().mockReturnValue('PENDENTE'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacaoController],
      providers: [{ provide: NotificacaoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<NotificacaoController>(NotificacaoController);
  });

  it('É necessário lançar erro se mensagem estiver vazia', async () => {
    await expect(controller.criar({ conteudoMensagem: '' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('É necessário criar notificação retornando status 202', async () => {
    const result = await controller.criar({ conteudoMensagem: 'Teste' });
    expect(result).toEqual({
      mensagemId: 'uuid123',
      status: 'Aceito para processamento',
    });
  });
});
