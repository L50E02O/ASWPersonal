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
import { ConferenciaService } from "./conferencia.service";
import { CrearConferenciaDto, ActualizarConferenciaDto } from "../../../dominio/dto";

@Controller("conferencias")
export class ConferenciaController {
  constructor(private readonly conferenciaService: ConferenciaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() crearConferenciaDto: CrearConferenciaDto) {
    return this.conferenciaService.create(crearConferenciaDto);
  }

  @Get()
  findAll(@Query("estado") estado?: string) {
    if (estado) {
      return this.conferenciaService.findByEstado(estado);
    }
    return this.conferenciaService.findAll();
  }

  @Get("disponibles")
  findDisponibles() {
    return this.conferenciaService.findDisponibles();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.conferenciaService.findOne(id);
  }

  @Post(":id/inscribir")
  @HttpCode(HttpStatus.OK)
  inscribirUsuario(@Param("id") id: string) {
    return this.conferenciaService.inscribirUsuario(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() actualizarConferenciaDto: ActualizarConferenciaDto) {
    return this.conferenciaService.update(id, actualizarConferenciaDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.conferenciaService.remove(id);
  }
}

