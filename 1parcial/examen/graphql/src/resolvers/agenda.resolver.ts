import { Resolver, Query, Args, ID } from "@nestjs/graphql";
import { AgendaType } from "../types/agenda.type";
import { RestClientService } from "../rest-client/rest-client.service";

@Resolver(() => AgendaType)
export class AgendaResolver {
  constructor(private readonly restClient: RestClientService) {}

  @Query(() => [AgendaType], { name: "agendas" })
  async getAgendas(
    @Args("usuarioId", { type: () => ID, nullable: true }) usuarioId?: string,
    @Args("conferenciaId", { type: () => ID, nullable: true }) conferenciaId?: string,
    @Args("estado", { nullable: true }) estado?: string
  ): Promise<AgendaType[]> {
    const agendas = await this.restClient.getAgendas(usuarioId, conferenciaId, estado);
    return agendas.map((agenda) => this.transformarAgenda(agenda));
  }

  @Query(() => AgendaType, { name: "agenda", nullable: true })
  async getAgendaById(@Args("id", { type: () => ID }) id: string): Promise<AgendaType | null> {
    try {
      const agenda = await this.restClient.getAgendaById(id);
      return this.transformarAgenda(agenda);
    } catch (error) {
      return null;
    }
  }

  @Query(() => [AgendaType], { name: "proximasAgendas" })
  async getProximasAgendas(@Args("limite", { type: () => Number, nullable: true, defaultValue: 10 }) limite: number): Promise<AgendaType[]> {
    const todasAgendas = await this.restClient.getAgendas();
    const ahora = new Date();
    
    // Filtrar agendas futuras y ordenar por fecha
    const proximas = todasAgendas
      .filter((agenda) => new Date(agenda.fechaAgendada) > ahora)
      .sort((a, b) => new Date(a.fechaAgendada).getTime() - new Date(b.fechaAgendada).getTime())
      .slice(0, limite);

    return proximas.map((agenda) => this.transformarAgenda(agenda));
  }

  private transformarAgenda(agenda: any): AgendaType {
    const fechaAgendada = new Date(agenda.fechaAgendada);
    const ahora = new Date();
    const proxima = fechaAgendada > ahora;
    
    // Calcular tiempo restante
    let tiempoRestante: string | undefined;
    if (proxima) {
      const diffMs = fechaAgendada.getTime() - ahora.getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDias > 0) {
        tiempoRestante = `${diffDias} día${diffDias > 1 ? "s" : ""} y ${diffHoras} hora${diffHoras > 1 ? "s" : ""}`;
      } else if (diffHoras > 0) {
        tiempoRestante = `${diffHoras} hora${diffHoras > 1 ? "s" : ""}`;
      } else {
        const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        tiempoRestante = `${diffMinutos} minuto${diffMinutos > 1 ? "s" : ""}`;
      }
    }

    return {
      id: agenda.id,
      fechaAgendada,
      notas: agenda.notas || undefined,
      estado: agenda.estado,
      fechaCreacion: new Date(agenda.fechaCreacion),
      usuario: agenda.usuario ? this.transformarUsuario(agenda.usuario) : undefined,
      conferencia: agenda.conferencia ? this.transformarConferencia(agenda.conferencia) : undefined,
      proxima,
      tiempoRestante,
    };
  }

  private transformarUsuario(usuario: any): any {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      fechaRegistro: new Date(usuario.fechaRegistro),
    };
  }

  private transformarConferencia(conferencia: any): any {
    return {
      id: conferencia.id,
      titulo: conferencia.titulo,
      descripcion: conferencia.descripcion,
      fechaInicio: new Date(conferencia.fechaInicio),
      fechaFin: new Date(conferencia.fechaFin),
      ubicacion: conferencia.ubicacion,
      precio: parseFloat(conferencia.precio),
    };
  }
}

