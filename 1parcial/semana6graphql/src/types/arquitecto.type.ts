import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { UsuarioType } from './usuario.type';

@ObjectType()
export class ArquitectoType {
  @Field(() => ID)
  id: string;

  @Field()
  cedula: string;

  @Field(() => Float)
  valoracion_prom_proyecto: number;

  @Field()
  descripcion: string;

  @Field()
  especialidades: string;

  @Field()
  ubicacion: string;

  @Field()
  verificado: boolean;

  @Field(() => Int)
  vistas_perfil: number;

  @Field(() => ID, { nullable: true })
  usuario_id?: string;

  @Field(() => UsuarioType, { nullable: true })
  Usuario?: UsuarioType;
}