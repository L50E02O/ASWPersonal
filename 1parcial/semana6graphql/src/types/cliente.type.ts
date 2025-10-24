import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UsuarioType } from './usuario.type';
@ObjectType()
export class ClienteType {
    @Field(() => ID)
    id: string;
    
    @Field(() => String)
    cedula: string;

    @Field(() => ID, { nullable: true })
    usuario_id?: string;

    @Field(() => UsuarioType, { nullable: true })
    Usuario?: UsuarioType;
}