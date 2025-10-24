import { Injectable, Logger } from '@nestjs/common';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';
import { KPIsPlataforma, UsuariosPorRol } from './entities/kpis-plataforma.entity';

@Injectable()
export class KpisPlataformaService {
  private readonly logger = new Logger(KpisPlataformaService.name);
  constructor(private readonly restClient: RestClientService) {}

  async getKpis(): Promise<KPIsPlataforma> {
    try {
      // Obtener datos de la plataforma
      const [usuarios, arquitectos, clientes, proyectos, incidencias] = await Promise.all([
        this.restClient.getUsuarios(),
        this.restClient.getArquitectos(),
        this.restClient.getClientes(),
        this.restClient.getProyectos(),
        this.restClient.getIncidencias(),
      ]);

      // Usuarios por rol
      const roles: Record<string, number> = {};
      for (const usuario of usuarios) {
        const rol = usuario.rol || 'desconocido';
        roles[rol] = (roles[rol] || 0) + 1;
      }
      const usuariosPorRol: UsuariosPorRol[] = Object.entries(roles).map(([rol, cantidad]) => ({ rol, cantidad }));

      // Arquitectos verificados
      const arquitectosVerificados = arquitectos.filter(a => a.verificado === true).length;

      // KPIs
      const kpis = new KPIsPlataforma();
      kpis.total_usuarios = usuarios.length;
      kpis.usuarios_por_rol = usuariosPorRol;
      kpis.total_proyectos = proyectos.length;
      kpis.total_arquitectos = arquitectos.length;
      kpis.total_clientes = clientes.length;
      kpis.total_incidencias = incidencias.length;
      kpis.arquitectos_verificados = arquitectosVerificados;
      return kpis;
    } catch (error) {
      this.logger.error('Error obteniendo KPIs de la plataforma', error);
      throw error;
    }
  }
}
