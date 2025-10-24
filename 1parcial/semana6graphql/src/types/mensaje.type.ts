import { ObjectType, Field, ID, Float } from '@nestjs/graphql';


@ObjectType()
export class Conversacion {
    @Field(() => ID)
    id: string
    @Field(() => String)
    contenido: string
    @Field(() => Float)
    fecha_envio: number
    @Field(() => Boolean)
    leido: boolean
    @Field(() => ID)
    conversacion_id: string
    @Field(() => ID)
    usuario_emisor_id: string

}