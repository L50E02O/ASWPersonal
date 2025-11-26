import { ObjectType, Field, Int, Float } from "@nestjs/graphql";

@ObjectType()
export class EstadisticasConferenciasType {
  @Field(() => Int)
  totalConferencias!: number;

  @Field(() => Int)
  conferenciasActivas!: number;

  @Field(() => Int)
  conferenciasCompletas!: number;

  @Field(() => Int)
  totalInscritos!: number;

  @Field(() => Float)
  promedioInscritosPorConferencia!: number;

  @Field(() => Float)
  ingresosTotales!: number;

  @Field(() => Float)
  ingresosPromedio!: number;
}

@ObjectType()
export class EstadisticasUsuariosType {
  @Field(() => Int)
  totalUsuarios!: number;

  @Field(() => Int)
  usuariosConConferencias!: number;

  @Field(() => Int)
  usuariosConAgendas!: number;

  @Field(() => Float)
  promedioConferenciasPorUsuario!: number;
}

@ObjectType()
export class EstadisticasAgendasType {
  @Field(() => Int)
  totalAgendas!: number;

  @Field(() => Int)
  agendasPendientes!: number;

  @Field(() => Int)
  agendasConfirmadas!: number;

  @Field(() => Float)
  porcentajeConfirmacion!: number;
}

@ObjectType()
export class EstadisticasGeneralesType {
  @Field(() => EstadisticasConferenciasType)
  conferencias!: EstadisticasConferenciasType;

  @Field(() => EstadisticasUsuariosType)
  usuarios!: EstadisticasUsuariosType;

  @Field(() => EstadisticasAgendasType)
  agendas!: EstadisticasAgendasType;
}

