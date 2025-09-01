/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notificações')
@Controller('api/notificar')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) { }

  @ApiOperation({ summary: 'Envio de mensagem' })
  @ApiResponse({
    status: 202,
    description: 'Requisição foi recebida e será processada assincronamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum registro encontrado para essa pesquisa',
  })
  @Post()
  @HttpCode(202)
  async criar(@Body() body: { conteudoMensagem: string }) {
    if (!body.conteudoMensagem || !body.conteudoMensagem.trim()) {
      throw new BadRequestException('Mensagem não pode ser vazia');
    }

    try {
      const { mensagemId } = await this.notificacaoService.criarNotificacao(
        body.conteudoMensagem,
      );
      return { mensagemId, status: 'Aceito para processamento' };
    } catch (error) {
      console.error('Erro ao criar notificação:', error.message);
      throw new InternalServerErrorException('Falha ao processar requisição');
    }
  }

  @ApiResponse({
    status: 404,
    description: 'Nenhum registro encontrado para essa pesquisa',
  })
  @Get(':mensagemId')
  consultar(@Param('mensagemId') mensagemId: string) {
    return {
      mensagemId,
      status: this.notificacaoService.consultarStatus(mensagemId),
    };
  }
}
