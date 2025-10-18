import { PartialType } from '@nestjs/swagger';
import { CreateConversacionDto } from './create-conversacion.dto';

export class UpdateConversacionDto extends PartialType(CreateConversacionDto) {}
