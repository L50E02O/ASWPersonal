import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class ProyectoType {
  @Field(() => ID)
  id: string;

  @Field()
  titulo_proyecto: string;

  @Field(() => Float)
  valoracion_promedio: number;
  
  @Field()
  descripcion: string;

  @Field()
  tipo_proyecto: string;

  @Field()
  fecha_publicacion: string;

  @Field(() => ID, { nullable: true })
  clienteId?: string;

  @Field(() => ID, { nullable: true })
  arquitectoId?: string;

  @Field({ nullable: true })
  fechaInicio?: string;

  @Field({ nullable: true })
  fechaFin?: string;

  @Field(() => ID, { nullable: true })
  conversacionId?: string;

  @Field(() => ID, { nullable: true })
  solicitudProyectoId?: string;
}
