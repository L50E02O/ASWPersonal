import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvanceService } from './avance.service';
import { CreateAvanceDto } from './dto/create-avance.dto';
import { UpdateAvanceDto } from './dto/update-avance.dto';

@Controller('avance')
export class AvanceController {
  constructor(private readonly avanceService: AvanceService) {}

  @Post()
  create(@Body() createAvanceDto: CreateAvanceDto) {
    return this.avanceService.create(createAvanceDto);
  }

  @Get()
  findAll() {
    return this.avanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvanceDto: UpdateAvanceDto) {
    return this.avanceService.update(id, updateAvanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avanceService.remove(id);
  }
}
