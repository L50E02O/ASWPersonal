import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SolicitudproyectoService } from './solicitudproyecto.service';
import { CreateSolicitudProyectoDto } from './dto/create-solicitudproyecto.dto';
import { UpdateSolicitudproyectoDto } from './dto/update-solicitudproyecto.dto';

@Controller('solicitudproyecto')
export class SolicitudproyectoController {
  constructor(private readonly solicitudproyectoService: SolicitudproyectoService) {}

  @Post()
  create(@Body() createSolicitudproyectoDto: CreateSolicitudProyectoDto) {
    return this.solicitudproyectoService.create(createSolicitudproyectoDto);
  }

  @Get()
  findAll() {
    return this.solicitudproyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudproyectoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolicitudproyectoDto: UpdateSolicitudproyectoDto) {
    return this.solicitudproyectoService.update(id, updateSolicitudproyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitudproyectoService.remove(id);
  }
}
