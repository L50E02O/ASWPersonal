import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ArquitectoType } from 'src/types/arquitecto.type';
import { UsuarioType } from 'src/types/usuario.type';
import { ProyectoType } from 'src/types/proyecto.type';

@ObjectType()
export class PerfilCompletoArquitecto {
  @Field(() => ArquitectoType)
  arquitecto: ArquitectoType;

  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => [ProyectoType])
  proyectos: ProyectoType[];

  @Field(() => Int)
  totalProyectos: number;

  @Field(() => Float)
  valoracionPromedio: number;
}