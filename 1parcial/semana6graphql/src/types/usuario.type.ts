import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class UsuarioType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  nombre: string;

  @Field(() => String)
  apellido: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  estado_cuenta: string;

  @Field(() => String)
  fecha_registro: string;

  @Field(() => String, { nullable: true })
  foto_perfil?: string;

  @Field(() => String, { nullable: true })
  telefono?: string;

  @Field(() => String, { nullable: true })
  direccion?: string;

  @Field(() => String)
  rol: string; // "cliente", "arquitecto", etc.
}
