import { CreateKpisPlataformaInput } from './create-kpis-plataforma.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateKpisPlataformaInput extends PartialType(CreateKpisPlataformaInput) {
  @Field(() => Int)
  id: number;
}
