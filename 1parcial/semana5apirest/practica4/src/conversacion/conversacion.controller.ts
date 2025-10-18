import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConversacionService } from './conversacion.service';
import { CreateConversacionDto } from './dto/create-conversacion.dto';
import { UpdateConversacionDto } from './dto/update-conversacion.dto';

@Controller('conversacion')
export class ConversacionController {
  constructor(private readonly conversacionService: ConversacionService) {}

  @Post()
  create(@Body() createConversacionDto: CreateConversacionDto) {
    return this.conversacionService.create(createConversacionDto);
  }

  @Get()
  findAll() {
    return this.conversacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversacionDto: UpdateConversacionDto) {
    return this.conversacionService.update(id, updateConversacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversacionService.remove(id);
  }
}
