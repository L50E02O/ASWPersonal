import { Injectable, Logger } from '@nestjs/common';
import { DashboardProyecto } from './entities/dashboard-proyecto.entity';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';
import { ArquitectoType } from 'src/types/arquitecto.type';
import { AvanceType } from 'src/types/avance.type';
import { ClienteType } from 'src/types/cliente.type';
import { ProyectoType } from 'src/types/proyecto.type';
import { UsuarioType } from 'src/types/usuario.type';
import { ValoracionType } from 'src/types/valoracion.type';


@Injectable()
export class DashboardProyectoService {
  private readonly logger = new Logger(DashboardProyectoService.name);

  constructor(private readonly restClient: RestClientService) {}

  async obtenerDashboardProyecto(proyectoId: string): Promise<DashboardProyecto> {
    try {
      // Obtener proyecto
      const proyData = await this.restClient.getProyecto(proyectoId);

      const proyecto = new ProyectoType();
      Object.assign(proyecto, proyData);

      // Arquitecto
      const arqData = await this.restClient.getArquitecto(proyData.arquitecto_id);
      const arqUsuario = arqData.usuario || {};

      const arquitecto = new ArquitectoType();
      Object.assign(arquitecto, arqData);

      const arquitectoUsuario = new UsuarioType();
      Object.assign(arquitectoUsuario, arqUsuario);

      // Cliente (opcional)
      let cliente: ClienteType | null = null;
      let clienteUsuario: UsuarioType | null = null;
      if (proyData.cliente_id) {
        try {
          const cliData = await this.restClient.getCliente(proyData.cliente_id);
          const cliUsuario = cliData.usuario || {};

          cliente = new ClienteType();
          Object.assign(cliente, cliData);

          clienteUsuario = new UsuarioType();
          Object.assign(clienteUsuario, cliUsuario);
        } catch (error) {
          this.logger.warn(`Cliente no encontrado para el proyecto ${proyectoId}`);
        }
      }

      // Avances
      const avancesData = await this.restClient.getAvances({ proyecto_id: proyectoId });
      const avances = avancesData
        .filter((a) => a.proyecto_id === proyectoId)
        .map((a) => Object.assign(new AvanceType(), a));

      // Valoraciones
      const valoracionesData = await this.restClient.getValoraciones({ proyecto_id: proyectoId });
      const valoraciones = valoracionesData
        .filter((v) => v.proyecto_id === proyectoId)
        .map((v) => Object.assign(new ValoracionType(), v));

      const valProm =
        valoraciones.length > 0
          ? valoraciones.reduce((acc, v) => acc + (v.puntuacion || 0), 0) / valoraciones.length
          : proyData.valoracion_promedio || 0.0;

      // Resultado final
      return {
        proyecto,
        arquitecto,
        arquitectoUsuario,
        cliente: cliente ?? null,
        clienteUsuario,
        avances,
        valoraciones,
        totalAvances: avances.length,
        valoracionPromedio: valProm,
      };
    } catch (e) {
      this.logger.error(`Error en dashboardProyecto: ${e.message}`, e.stack);
      throw e;
    }
  }
}
