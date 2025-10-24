import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

/**
 * Métricas calculadas de un proyecto específico
 */
@ObjectType()
export class MetricasProyecto {
	@Field(() => ID, { nullable: true, description: 'ID del proyecto' })
	proyecto_id?: string;

	@Field(() => String, { nullable: true, description: 'Título del proyecto' })
	titulo?: string;

	@Field(() => Int, { nullable: true, description: 'Total de avances registrados en el proyecto' })
	total_avances?: number;

	@Field(() => Int, { nullable: true, description: 'Total de valoraciones recibidas' })
	total_valoraciones?: number;

	@Field(() => Float, { nullable: true, description: 'Valoración promedio del proyecto' })
	valoracion_promedio?: number;

	@Field(() => Int, { nullable: true, description: 'Días transcurridos desde el inicio del proyecto' })
	dias_transcurridos?: number;

	@Field(() => String, { nullable: true, description: 'Estado actual del proyecto' })
	estado?: string;
}
