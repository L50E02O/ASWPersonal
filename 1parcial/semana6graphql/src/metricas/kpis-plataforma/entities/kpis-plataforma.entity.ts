import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * Usuarios agrupados por rol
 */
@ObjectType()
export class UsuariosPorRol {
	@Field(() => String, { nullable: true, description: 'Rol del usuario' })
	rol?: string;

	@Field(() => Int, { nullable: true, description: 'Cantidad de usuarios con este rol' })
	cantidad?: number;
}

/**
 * KPIs generales de la plataforma
 */
@ObjectType()
export class KPIsPlataforma {
	@Field(() => Int, { nullable: true, description: 'Total de usuarios en la plataforma' })
	total_usuarios?: number;

	@Field(() => [UsuariosPorRol], { nullable: true, description: 'Distribución de usuarios por rol' })
	usuarios_por_rol?: UsuariosPorRol[];

	@Field(() => Int, { nullable: true, description: 'Total de proyectos en la plataforma' })
	total_proyectos?: number;

	@Field(() => Int, { nullable: true, description: 'Total de arquitectos registrados' })
	total_arquitectos?: number;

	@Field(() => Int, { nullable: true, description: 'Total de clientes registrados' })
	total_clientes?: number;

	@Field(() => Int, { nullable: true, description: 'Total de incidencias reportadas' })
	total_incidencias?: number;

	@Field(() => Int, { nullable: true, description: 'Arquitectos con verificación activa' })
	arquitectos_verificados?: number;
}

// Compatibilidad: nombre exportado por resolvers
export { KPIsPlataforma as KpisPlataforma };
