import { InputType, Field, ID} from '@nestjs/graphql';

@InputType()
export class BuscarConversacionesInput {
  @Field(() => ID, { nullable: true })
  usuarioId?: string;

  @Field(() => ID, { nullable: true })
  arquitectoId?: string;

  @Field({ nullable: true })
  despuesDe?: string;
}
