import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModeradorService } from './moderador.service';
import { CreateModeradorDto } from './dto/create-moderador.dto';
import { UpdateModeradorDto } from './dto/update-moderador.dto';

@Controller('moderadores')
export class ModeradorController {
  constructor(private readonly moderadorService: ModeradorService) {}

  @Post()
  create(@Body() dto: CreateModeradorDto) {
    return this.moderadorService.create(dto);
  }

  @Get()
  findAll() {
    return this.moderadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moderadorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModeradorDto) {
    return this.moderadorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moderadorService.remove(id);
  }
}
