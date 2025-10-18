import { PartialType } from '@nestjs/swagger';
import { CreateArquitectoDto } from './create-arquitecto.dto';

export class UpdateArquitectoDto extends PartialType(CreateArquitectoDto) {}
