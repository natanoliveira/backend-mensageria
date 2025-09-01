/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  HttpCode,
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

    const { mensagemId } = await this.notificacaoService.criarNotificacao(
      body.conteudoMensagem,
    );
    return { status: 'Aceito para processamento', mensagemId };
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
