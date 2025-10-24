import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEstadisticaArquitectoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
