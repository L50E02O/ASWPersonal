import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { CreateValoracionDto } from './dto/create-valoracion.dto';
import { UpdateValoracionDto } from './dto/update-valoracion.dto';

@Controller('valoracion')
export class ValoracionController {
  constructor(private readonly valoracionService: ValoracionService) {}

  @Post()
  create(@Body() createValoracionDto: CreateValoracionDto) {
    return this.valoracionService.create(createValoracionDto);
  }

  @Get()
  findAll() {
    return this.valoracionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valoracionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValoracionDto: UpdateValoracionDto) {
    return this.valoracionService.update(id, updateValoracionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valoracionService.remove(id);
  }
}
