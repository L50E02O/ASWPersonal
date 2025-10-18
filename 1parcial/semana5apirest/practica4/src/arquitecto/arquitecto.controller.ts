import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArquitectoService } from './arquitecto.service';
import { CreateArquitectoDto } from './dto/create-arquitecto.dto';
import { UpdateArquitectoDto } from './dto/update-arquitecto.dto';

@Controller('arquitecto')
export class ArquitectoController {
  constructor(private readonly arquitectoService: ArquitectoService) {}

  @Post()
  create(@Body() createArquitectoDto: CreateArquitectoDto) {
    return this.arquitectoService.create(createArquitectoDto);
  }

  @Get()
  findAll() {
    return this.arquitectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arquitectoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArquitectoDto: UpdateArquitectoDto) {
    return this.arquitectoService.update(id, updateArquitectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arquitectoService.remove(id);
  }
}
