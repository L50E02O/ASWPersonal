import { CreateBusquedaInput } from './create-busqueda.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusquedaInput extends PartialType(CreateBusquedaInput) {
  @Field(() => Int)
  id: number;
}
