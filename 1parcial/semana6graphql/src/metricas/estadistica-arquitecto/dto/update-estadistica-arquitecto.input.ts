import { CreateEstadisticaArquitectoInput } from './create-estadistica-arquitecto.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEstadisticaArquitectoInput extends PartialType(CreateEstadisticaArquitectoInput) {
  @Field(() => Int)
  id: number;
}
