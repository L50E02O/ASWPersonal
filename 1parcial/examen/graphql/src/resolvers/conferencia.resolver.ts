import { Resolver, Query, Args, ID } from "@nestjs/graphql";
import { ConferenciaType } from "../types/conferencia.type";
import { RestClientService } from "../rest-client/rest-client.service";

@Resolver(() => ConferenciaType)
export class ConferenciaResolver {
  constructor(private readonly restClient: RestClientService) {}

  @Query(() => [ConferenciaType], { name: "conferencias" })
  async getConferencias(@Args("estado", { nullable: true }) estado?: string): Promise<ConferenciaType[]> {
    const conferencias = await this.restClient.getConferencias(estado);
    return conferencias.map((conf) => this.transformarConferencia(conf));
  }

  @Query(() => ConferenciaType, { name: "conferencia", nullable: true })
  async getConferenciaById(@Args("id", { type: () => ID }) id: string): Promise<ConferenciaType | null> {
    try {
      const conferencia = await this.restClient.getConferenciaById(id);
      return this.transformarConferencia(conferencia);
    } catch (error) {
      return null;
    }
  }

  @Query(() => [ConferenciaType], { name: "conferenciasDisponibles" })
  async getConferenciasDisponibles(): Promise<ConferenciaType[]> {
    const conferencias = await this.restClient.getConferenciasDisponibles();
    return conferencias.map((conf) => this.transformarConferencia(conf));
  }

  private transformarConferencia(conferencia: any): ConferenciaType {
    const fechaInicio = new Date(conferencia.fechaInicio);
    const fechaFin = new Date(conferencia.fechaFin);
    const cuposDisponibles = conferencia.capacidadMaxima - conferencia.inscritos;
    const porcentajeOcupacion = (conferencia.inscritos / conferencia.capacidadMaxima) * 100;
    const disponible = cuposDisponibles > 0 && conferencia.estado === "activa";
    
    // Calcular duración en horas
    const duracionMs = fechaFin.getTime() - fechaInicio.getTime();
    const duracionHoras = Math.round(duracionMs / (1000 * 60 * 60));
    const duracion = `${duracionHoras} horas`;

    return {
      id: conferencia.id,
      titulo: conferencia.titulo,
      descripcion: conferencia.descripcion,
      fechaInicio,
      fechaFin,
      ubicacion: conferencia.ubicacion,
      precio: parseFloat(conferencia.precio),
      capacidadMaxima: conferencia.capacidadMaxima,
      inscritos: conferencia.inscritos,
      estado: conferencia.estado,
      organizador: conferencia.organizador ? this.transformarOrganizador(conferencia.organizador) : undefined,
      agendas: conferencia.agendas?.map((a: any) => this.transformarAgenda(a)),
      // Campos transformados
      cuposDisponibles,
      porcentajeOcupacion: Math.round(porcentajeOcupacion * 100) / 100,
      disponible,
      duracion,
    };
  }

  private transformarOrganizador(organizador: any): any {
    return {
      id: organizador.id,
      nombre: organizador.nombre,
      correo: organizador.correo,
      telefono: organizador.telefono,
      fechaRegistro: new Date(organizador.fechaRegistro),
    };
  }

  private transformarAgenda(agenda: any): any {
    return {
      ...agenda,
      fechaAgendada: new Date(agenda.fechaAgendada),
      fechaCreacion: new Date(agenda.fechaCreacion),
    };
  }
}

