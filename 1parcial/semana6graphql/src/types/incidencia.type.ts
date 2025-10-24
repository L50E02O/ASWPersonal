import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ModeradorType } from './moderador.type';

@ObjectType()
export class Incidencia {
 @Field(() => ID)
 id: string;
    @Field(() => String)
    descripcion: string;
    @Field(() => String)
    estado: string;
    @Field(() => String)
    fecha: string;
    @Field(() => ID)
    usuario_emisor_id: string;
    @Field(() => ID)
    usuario_receptor_id: string;
    @Field(() => ID)
    moderador_id: string;
    @Field(() => ModeradorType)
    moderador: ModeradorType;
}
