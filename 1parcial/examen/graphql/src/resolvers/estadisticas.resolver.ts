import { Resolver, Query } from "@nestjs/graphql";
import { EstadisticasGeneralesType, EstadisticasConferenciasType, EstadisticasUsuariosType, EstadisticasAgendasType } from "../types/estadisticas.type";
import { RestClientService } from "../rest-client/rest-client.service";

@Resolver(() => EstadisticasGeneralesType)
export class EstadisticasResolver {
  constructor(private readonly restClient: RestClientService) {}

  @Query(() => EstadisticasGeneralesType, { name: "estadisticas" })
  async getEstadisticas(): Promise<EstadisticasGeneralesType> {
    const [conferencias, usuarios, agendas] = await Promise.all([
      this.restClient.getConferencias(),
      this.restClient.getUsuarios(),
      this.restClient.getAgendas(),
    ]);

    return {
      conferencias: this.calcularEstadisticasConferencias(conferencias),
      usuarios: this.calcularEstadisticasUsuarios(usuarios),
      agendas: this.calcularEstadisticasAgendas(agendas),
    };
  }

  @Query(() => EstadisticasConferenciasType, { name: "estadisticasConferencias" })
  async getEstadisticasConferencias(): Promise<EstadisticasConferenciasType> {
    const conferencias = await this.restClient.getConferencias();
    return this.calcularEstadisticasConferencias(conferencias);
  }

  @Query(() => EstadisticasUsuariosType, { name: "estadisticasUsuarios" })
  async getEstadisticasUsuarios(): Promise<EstadisticasUsuariosType> {
    const usuarios = await this.restClient.getUsuarios();
    return this.calcularEstadisticasUsuarios(usuarios);
  }

  @Query(() => EstadisticasAgendasType, { name: "estadisticasAgendas" })
  async getEstadisticasAgendas(): Promise<EstadisticasAgendasType> {
    const agendas = await this.restClient.getAgendas();
    return this.calcularEstadisticasAgendas(agendas);
  }

  private calcularEstadisticasConferencias(conferencias: any[]): EstadisticasConferenciasType {
    const totalConferencias = conferencias.length;
    const conferenciasActivas = conferencias.filter((c) => c.estado === "activa").length;
    const conferenciasCompletas = conferencias.filter((c) => c.estado === "completa").length;
    const totalInscritos = conferencias.reduce((sum, c) => sum + (c.inscritos || 0), 0);
    const promedioInscritosPorConferencia = totalConferencias > 0 ? totalInscritos / totalConferencias : 0;
    const ingresosTotales = conferencias.reduce((sum, c) => sum + (parseFloat(c.precio) * (c.inscritos || 0)), 0);
    const ingresosPromedio = totalConferencias > 0 ? ingresosTotales / totalConferencias : 0;

    return {
      totalConferencias,
      conferenciasActivas,
      conferenciasCompletas,
      totalInscritos,
      promedioInscritosPorConferencia: Math.round(promedioInscritosPorConferencia * 100) / 100,
      ingresosTotales: Math.round(ingresosTotales * 100) / 100,
      ingresosPromedio: Math.round(ingresosPromedio * 100) / 100,
    };
  }

  private calcularEstadisticasUsuarios(usuarios: any[]): EstadisticasUsuariosType {
    const totalUsuarios = usuarios.length;
    const usuariosConConferencias = usuarios.filter((u) => u.conferencias && u.conferencias.length > 0).length;
    const usuariosConAgendas = usuarios.filter((u) => u.agendas && u.agendas.length > 0).length;
    const totalConferencias = usuarios.reduce((sum, u) => sum + (u.conferencias?.length || 0), 0);
    const promedioConferenciasPorUsuario = totalUsuarios > 0 ? totalConferencias / totalUsuarios : 0;

    return {
      totalUsuarios,
      usuariosConConferencias,
      usuariosConAgendas,
      promedioConferenciasPorUsuario: Math.round(promedioConferenciasPorUsuario * 100) / 100,
    };
  }

  private calcularEstadisticasAgendas(agendas: any[]): EstadisticasAgendasType {
    const totalAgendas = agendas.length;
    const agendasPendientes = agendas.filter((a) => a.estado === "pendiente").length;
    const agendasConfirmadas = agendas.filter((a) => a.estado === "confirmada").length;
    const porcentajeConfirmacion = totalAgendas > 0 ? (agendasConfirmadas / totalAgendas) * 100 : 0;

    return {
      totalAgendas,
      agendasPendientes,
      agendasConfirmadas,
      porcentajeConfirmacion: Math.round(porcentajeConfirmacion * 100) / 100,
    };
  }
}

