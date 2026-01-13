import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateArquitectoDto } from './dto/create-arquitecto.dto';
import { UpdateArquitectoDto } from './dto/update-arquitecto.dto';
import { WebhookEmitterService } from '../common/webhook-emitter.service';

/**
 * Controlador REST de Arquitecto
 * Expone endpoints HTTP que enrutan a través de RabbitMQ al microservicio
 */
@Controller('arquitectos')
export class ArquitectoController {
  constructor(
    @Inject('ARQUITECTO_SERVICE') private readonly client: ClientProxy,
    private readonly webhookEmitter: WebhookEmitterService,
  ) {}

  /**
   * GET /arquitectos
   * Lista todos los arquitectos
   */
  @Get()
  async findAll() {
    try {
      return await firstValueFrom(this.client.send('arquitecto.findAll', {}));
    } catch (error) {
      throw new HttpException(
        'Error al obtener arquitectos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /arquitectos/:id
   * Obtiene un arquitecto por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.client.send('arquitecto.findOne', { id }));
    } catch (error) {
      if (error.message?.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al obtener arquitecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /arquitectos
   * Crea un nuevo arquitecto
   */
  @Post()
  async create(@Body() createArquitectoDto: CreateArquitectoDto) {
    try {
      const resultado = await firstValueFrom(
        this.client.send('arquitecto.create', createArquitectoDto),
      );

      // Emitir webhook después de crear exitosamente
      await this.webhookEmitter.emit('arquitecto.creado', {
        arquitecto: resultado,
        datosCreacion: createArquitectoDto,
      });

      return resultado;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear arquitecto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * PATCH /arquitectos/:id
   * Actualiza un arquitecto existente
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArquitectoDto: UpdateArquitectoDto,
  ) {
    try {
      const resultado = await firstValueFrom(
        this.client.send('arquitecto.update', { id, updateDto: updateArquitectoDto }),
      );

      // Emitir webhook después de actualizar exitosamente
      await this.webhookEmitter.emit('arquitecto.actualizado', {
        arquitecto: resultado,
        id,
        datosActualizacion: updateArquitectoDto,
      });

      return resultado;
    } catch (error) {
      if (error.message?.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Error al actualizar arquitecto',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

