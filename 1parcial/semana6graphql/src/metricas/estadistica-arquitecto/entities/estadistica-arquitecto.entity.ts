import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

/**
 * Agrupación de proyectos por tipo
 */
@ObjectType()
export class ProyectosPorTipo {
	@Field(() => String, { nullable: true, description: 'Tipo de proyecto' })
	tipo?: string;

	@Field(() => Int, { nullable: true, description: 'Cantidad de proyectos de este tipo' })
	cantidad?: number;
}

/**
 * Estadísticas completas de un arquitecto
 */
@ObjectType()
export class EstadisticasArquitecto {
	@Field(() => ID, { nullable: true, description: 'ID del arquitecto' })
	arquitecto_id?: string;

	@Field(() => String, { nullable: true, description: 'Nombre completo del arquitecto' })
	nombre_completo?: string;

	@Field(() => Int, { nullable: true, description: 'Total de proyectos realizados' })
	total_proyectos?: number;

	@Field(() => Float, { nullable: true, description: 'Valoración promedio del arquitecto' })
	valoracion_promedio?: number;

	@Field(() => [ProyectosPorTipo], { nullable: true, description: 'Distribución de proyectos por tipo' })
	proyectos_por_tipo?: ProyectosPorTipo[];

	@Field(() => Int, { nullable: true, description: 'Total de valoraciones recibidas' })
	total_valoraciones?: number;

	@Field(() => Boolean, { nullable: true, description: 'Indica si el arquitecto está verificado' })
	verificado?: boolean;
}

// Compatibilidad: algunos resolvers usan el nombre singular `EstadisticaArquitecto`
export { EstadisticasArquitecto as EstadisticaArquitecto };
