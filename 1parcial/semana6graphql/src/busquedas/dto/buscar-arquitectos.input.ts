import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class BuscarArquitectosInput {
  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  especialidad?: string;

  @Field(() => Int, { nullable: true })
  experienciaMinima?: number;
}
