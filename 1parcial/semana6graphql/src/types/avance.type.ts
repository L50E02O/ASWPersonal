import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { ProyectoType } from './proyecto.type';

@ObjectType()
export class AvanceType {
  @Field(() => ID)
  id: string;

  @Field()
  descripcion: string;

  @Field(() => Float)
  porcentaje_avance: number;

  @Field()
  fecha: string;

  @Field(() => ID, { nullable: true })
  proyecto_id?: string;

  @Field(() => ProyectoType, { nullable: true })
  Proyecto?: ProyectoType;
}