import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { AgendaService } from "./agenda.service";
import { CrearAgendaDto, ActualizarAgendaDto } from "../../../dominio/dto";

@Controller("agendas")
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() crearAgendaDto: CrearAgendaDto) {
    return this.agendaService.create(crearAgendaDto);
  }

  @Get()
  findAll(@Query("usuarioId") usuarioId?: string, @Query("conferenciaId") conferenciaId?: string, @Query("estado") estado?: string) {
    if (usuarioId) {
      return this.agendaService.findByUsuario(usuarioId);
    }
    if (conferenciaId) {
      return this.agendaService.findByConferencia(conferenciaId);
    }
    if (estado) {
      return this.agendaService.findByEstado(estado);
    }
    return this.agendaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.agendaService.findOne(id);
  }

  @Post(":id/confirmar")
  @HttpCode(HttpStatus.OK)
  confirmarAgenda(@Param("id") id: string) {
    return this.agendaService.confirmarAgenda(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() actualizarAgendaDto: ActualizarAgendaDto) {
    return this.agendaService.update(id, actualizarAgendaDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.agendaService.remove(id);
  }
}

