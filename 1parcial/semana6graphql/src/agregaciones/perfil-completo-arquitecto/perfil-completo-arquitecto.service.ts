import { Injectable, Logger } from '@nestjs/common';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';
import { PerfilCompletoArquitecto } from './entities/perfil-completo-arquitecto.entity';
import { ArquitectoType } from 'src/types/arquitecto.type';
import { UsuarioType } from 'src/types/usuario.type';
import { ProyectoType } from 'src/types/proyecto.type';


@Injectable()
export class PerfilCompletoArquitectoService {
  private readonly logger = new Logger(PerfilCompletoArquitectoService.name);

  constructor(private readonly restClient: RestClientService) {}

  async obtenerPerfilCompleto(arquitectoId: string): Promise<PerfilCompletoArquitecto> {
    try {
      // Obtener arquitecto
      const arqData = await this.restClient.getArquitecto(`/${arquitectoId}`);
      const usuarioData = arqData.usuario ?? {};

      const arquitecto: ArquitectoType = {
        id: arqData.id,
        cedula: arqData.cedula,
        valoracion_prom_proyecto: arqData.valoracion_prom_proyecto ?? 0.0,
        descripcion: arqData.descripcion ?? '',
        especialidades: arqData.especialidades ?? '',
        ubicacion: arqData.ubicacion ?? '',
        verificado: arqData.verificado ?? false,
        vistas_perfil: arqData.vistas_perfil ?? 0,
        usuario_id: usuarioData.id,
        Usuario: {
          id: usuarioData.id,
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          email: usuarioData.email,
          estado_cuenta: usuarioData.estado_cuenta,
          rol: usuarioData.rol,
          fecha_registro: usuarioData.fecha_registro,
          foto_perfil: usuarioData.foto_perfil,
        },
      };

      const usuario: UsuarioType = {
        id: usuarioData.id,
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        email: usuarioData.email,
        estado_cuenta: usuarioData.estado_cuenta,
        rol: usuarioData.rol,
        fecha_registro: usuarioData.fecha_registro,
        foto_perfil: usuarioData.foto_perfil,
      };

      // Obtener proyectos del arquitecto
      const proyectosData = await this.restClient.getProyectos({ arquitecto_id: arquitectoId });

      const proyectos: ProyectoType[] = proyectosData
        .filter((p: any) => String(p.arquitecto_id) === String(arquitectoId))
        .map(
          (p: any): ProyectoType => ({
            id: p.id,
            titulo_proyecto: p.titulo_proyecto,
            valoracion_promedio: p.valoracion_promedio ?? 0.0,
            descripcion: p.descripcion ?? '',
            tipo_proyecto: p.tipo_proyecto ?? '',
            fecha_publicacion: p.fecha_publicacion,
            arquitectoId: p.arquitecto_id,
            conversacionId: p.conversacion_id,
            clienteId: p.cliente_id,
            solicitudProyectoId: p.solicitud_proyecto_id,
          }),
        );

      const valoracionPromedio =
        proyectos.length > 0
          ? proyectos.reduce((sum, p) => sum + (p.valoracion_promedio ?? 0), 0) / proyectos.length
          : 0.0;

      return {
        arquitecto,
        usuario,
        proyectos,
        totalProyectos: proyectos.length,
        valoracionPromedio,
      };
    } catch (e) {
      this.logger.error(`Error en obtenerPerfilCompleto: ${e.message}`);
      throw e;
    }
  }
}
