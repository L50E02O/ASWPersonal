import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class BuscarProyectosInput {
  @Field(() => ID, { nullable: true })
  clienteId?: string;

  @Field({ nullable: true })
  estado?: string;

}
