import { Injectable, Logger } from '@nestjs/common';
import { CreateMetricasProyectoInput } from './dto/create-metricas-proyecto.input';
import { UpdateMetricasProyectoInput } from './dto/update-metricas-proyecto.input';
import { RestClientService } from 'src/ServicioHTTP/servicioHTTP.service';
import { MetricasProyecto } from './entities/metricas-proyecto.entity';

@Injectable()
export class MetricasProyectoService {
  private readonly logger = new Logger(MetricasProyectoService.name);

  constructor(private readonly restClient: RestClientService) {}

  create(createMetricasProyectoInput: CreateMetricasProyectoInput) {
    return 'This action adds a new metricasProyecto';
  }

  findAll() {
    return `This action returns all metricasProyecto`;
  }

  async findOne(id: string): Promise<MetricasProyecto> {
    try {
      // Obtener datos del proyecto
      const proyecto = await this.restClient.getProyecto(id);

      // Obtener avances del proyecto
      const avances = await this.restClient.getAvances({ proyecto_id: id });
      const avancesProyecto = avances.filter(a => a.proyecto_id === id);

      // Obtener valoraciones del proyecto
      const valoraciones = await this.restClient.getValoraciones({ proyecto_id: id });
      const valoracionesProyecto = valoraciones.filter(v => v.proyecto_id === id);

      // Calcular valoración promedio
      const valoracionPromedio = valoracionesProyecto.length > 0
        ? valoracionesProyecto.reduce((acc, v) => acc + (v.calificacion || v.puntuacion || 0), 0) / valoracionesProyecto.length
        : 0;

      // Calcular días transcurridos
      let diasTranscurridos: number | undefined = undefined;
      if (proyecto.fecha_inicio) {
        const fechaInicio = new Date(proyecto.fecha_inicio);
        const hoy = new Date();
        diasTranscurridos = Math.floor((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Determinar estado del proyecto
      let estado = 'En proceso';
      if (proyecto.fecha_fin) {
        estado = 'Finalizado';
      } else if (avancesProyecto.length === 0) {
        estado = 'Sin avances';
      } else if (avancesProyecto.some(a => a.porcentaje_avance >= 100)) {
        estado = 'Completado';
      }

      // Construir el objeto de métricas
      const metricas = new MetricasProyecto();
      metricas.proyecto_id = proyecto.id;
      metricas.titulo = proyecto.titulo_proyecto || proyecto.titulo || 'Sin título';
      metricas.total_avances = avancesProyecto.length;
      metricas.total_valoraciones = valoracionesProyecto.length;
      metricas.valoracion_promedio = valoracionPromedio;
      metricas.dias_transcurridos = diasTranscurridos;
      metricas.estado = estado;

      return metricas;
    } catch (error) {
      this.logger.error(`Error obteniendo métricas del proyecto ${id}:`, error);
      throw error;
    }
  }

  update(id: string, updateMetricasProyectoInput: UpdateMetricasProyectoInput) {
    return `This action updates a #${id} metricasProyecto`;
  }

  remove(id: string) {
    return `This action removes a #${id} metricasProyecto`;
  }
}
