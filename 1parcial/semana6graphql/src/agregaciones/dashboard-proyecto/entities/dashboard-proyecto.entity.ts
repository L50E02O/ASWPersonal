import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ArquitectoType } from 'src/types/arquitecto.type';
import { AvanceType } from 'src/types/avance.type';
import { ClienteType } from 'src/types/cliente.type';
import { ProyectoType } from 'src/types/proyecto.type';
import { UsuarioType } from 'src/types/usuario.type';
import { ValoracionType } from 'src/types/valoracion.type';

@ObjectType()
export class DashboardProyecto {
  @Field(() => ProyectoType)
  proyecto: ProyectoType;

  @Field(() => ArquitectoType)
  arquitecto: ArquitectoType;

  @Field(() => UsuarioType)
  arquitectoUsuario: UsuarioType;

  @Field(() => ClienteType, { nullable: true })
  cliente?: ClienteType | null;

  @Field(() => UsuarioType, { nullable: true })
  clienteUsuario?: UsuarioType | null;

  @Field(() => [AvanceType])
  avances: AvanceType[];

  @Field(() => [ValoracionType])
  valoraciones: ValoracionType[];

  @Field(() => Int)
  totalAvances: number;

  @Field(() => Number)
  valoracionPromedio: number;
}