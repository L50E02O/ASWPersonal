import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UsuarioType } from './usuario.type';

@ObjectType()
export class ModeradorType {
    @Field(() => ID)
    id: string;
    @Field(() => ID)
    usuario_id: string;
    @Field(() => UsuarioType)
    usuario: UsuarioType;
}
