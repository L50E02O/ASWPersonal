import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBusquedaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
