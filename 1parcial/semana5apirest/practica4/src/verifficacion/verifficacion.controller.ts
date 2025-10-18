import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerifficacionService } from './verifficacion.service';
import { CreateVerificacionDto } from './dto/create-verifficacion.dto';
import { UpdateVerificacionDto } from './dto/update-verifficacion.dto';

@Controller('verifficaciones')
export class VerifficacionController {
  constructor(private readonly verificacionService: VerifficacionService) {}

  @Post()
  create(@Body() dto: CreateVerificacionDto) {
    return this.verificacionService.create(dto);
  }

  @Get()
  findAll() {
    return this.verificacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verificacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVerificacionDto) {
    return this.verificacionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verificacionService.remove(id);
  }
}
