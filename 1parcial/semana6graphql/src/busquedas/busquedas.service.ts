import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';

@Injectable()
export class BusquedaService {
  constructor(private readonly restClient: RestClientService) {}

  async buscarArquitectos(filtros: any) {
    try {
      const { nombre, especialidad, experienciaMinima } = filtros;
      let arquitectos = await this.restClient.getArquitectos();

      if (nombre) arquitectos = arquitectos.filter(a => a.Usuario && a.Usuario.nombre && a.Usuario.nombre.toLowerCase().includes(nombre.toLowerCase()));
      if (especialidad) arquitectos = arquitectos.filter(a => a.especialidades && a.especialidades.toLowerCase().includes(especialidad.toLowerCase()));
      if (typeof experienciaMinima === 'number') arquitectos = arquitectos.filter(a => (a.experiencia || 0) >= experienciaMinima);

      return arquitectos;
    } catch (error) {
      throw new InternalServerErrorException(`Error al buscar arquitectos: ${error.message}`);
    }
  }

  async buscarProyectos(filtros: any) {
    try {
      const { clienteId, estado } = filtros;
      // Preferir que el backend haga el filtrado si soporta params (usa snake_case para la API)
      const params: any = {};
      if (clienteId) params.cliente_id = clienteId;
      if (estado) params.estado = estado;

      const proyectosData: any[] = await this.restClient.getProyectos(params);

      // Normalizar campos devueltos por la API (snake_case) a la forma usada por GraphQL (camelCase)
      let proyectos = proyectosData.map(p => ({
        id: p.id,
        titulo_proyecto: p.titulo_proyecto ?? p.titulo,
        valoracion_promedio: p.valoracion_promedio ?? 0,
        descripcion: p.descripcion ?? '',
        tipo_proyecto: p.tipo_proyecto ?? '',
        fecha_publicacion: p.fecha_publicacion,
        arquitectoId: p.arquitecto_id ?? p.arquitectoId,
        conversacionId: p.conversacion_id ?? p.conversacionId,
        clienteId: p.cliente_id ?? p.clienteId,
        solicitudProyectoId: p.solicitud_proyecto_id ?? p.solicitudProyectoId,
        fechaInicio: p.fecha_inicio ?? p.fechaInicio,
        fechaFin: p.fecha_fin ?? p.fechaFin,
        estado: p.estado ?? p.estado_proyecto,
      }));

      // Si por alguna razón el backend no filtró, aplicar filtros en memoria
      if (clienteId) proyectos = proyectos.filter(p => String(p.clienteId) === String(clienteId));
      if (estado) proyectos = proyectos.filter(p => p.estado && String(p.estado).toLowerCase() === String(estado).toLowerCase());

      return proyectos;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar proyectos');
    }
  }

  async buscarConversaciones(filtros: any) {
    try {
      console.log('Filtros recibidos:', filtros);

      // Enviar params al backend (snake_case)
      const params: any = {};
      if (filtros.usuarioId) params.usuario_id = filtros.usuarioId;
      if (filtros.arquitectoId) params.arquitecto_id = filtros.arquitectoId;

      let conversacionesData = await this.restClient.getConversaciones(params);

      // Normalizar campos
      let conversaciones = conversacionesData.map(c => ({
        ...c,
        id: c.id,
        usuarioId: c.usuario_id ?? c.usuarioId,
        arquitectoId: c.arquitecto_id ?? c.arquitectoId,
        fechaInicio: c.fecha_inicio ?? c.fechaInicio ?? c.created_at,
      }));

      console.log('Cantidad recibida antes de filtrar:', conversaciones.length);

      // Filtros en memoria
      if (filtros.usuarioId) conversaciones = conversaciones.filter(c => String(c.usuarioId) === String(filtros.usuarioId));
      if (filtros.arquitectoId) conversaciones = conversaciones.filter(c => String(c.arquitectoId) === String(filtros.arquitectoId));
      if (filtros.despuesDe) conversaciones = conversaciones.filter(c => new Date(c.fechaInicio) > new Date(filtros.despuesDe));

      console.log('Cantidad después de filtrar:', conversaciones.length);

      return conversaciones;
    } catch (error) {
      console.error('Error en buscarConversaciones:', error);
      throw new InternalServerErrorException('Error al buscar conversaciones');
    }
  }
}
