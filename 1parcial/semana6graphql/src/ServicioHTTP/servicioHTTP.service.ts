import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

/**
 * Cliente HTTP para comunicarse con el API REST de Rails.
 * Usa @nestjs/axios para peticiones HTTP.
 */
@Injectable()
export class RestClientService {
  private readonly logger = new Logger(RestClientService.name);
  private readonly baseUrl: string;

  constructor(private readonly http: HttpService) {
    this.baseUrl = process.env.REST_API_URL || 'http://localhost:3000/api/v1';
  }

  /**
   * Ejecuta una petición GET al API REST
   */
  private async request<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await firstValueFrom(
        this.http
          .get(url, { params })
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response) {
                this.logger.error(
                  `HTTP Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
                );
                throw new Error(`Error en API REST: ${error.response.status}`);
              } else if (error.request) {
                this.logger.error(`Request Error: ${error.message}`);
                throw new Error(`Error de conexión con API REST: ${error.message}`);
              }
              throw error;
            }),
          ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error en request GET ${endpoint}:`, error);
      throw error;
    }
  }

  // ==================== USUARIOS ====================

  async getUsuarios(params?: Record<string, any>): Promise<any[]> {
    return this.request('usuarios', params);
  }

  async getUsuario(usuarioId: string): Promise<any> {
    return this.request(`usuarios/${usuarioId}`);
  }

  // ==================== CLIENTES ====================

  async getClientes(params?: Record<string, any>): Promise<any[]> {
    return this.request('clientes', params);
  }

  async getCliente(clienteId: string): Promise<any> {
    return this.request(`clientes/${clienteId}`);
  }

  // ==================== ARQUITECTOS ====================

  async getArquitectos(params?: Record<string, any>): Promise<any[]> {
    return this.request('arquitectos', params);
  }

  async getArquitecto(arquitectoId: string): Promise<any> {
    return this.request(`arquitectos/${arquitectoId}`);
  }

  // ==================== PROYECTOS ====================

  async getProyectos(params?: Record<string, any>): Promise<any[]> {
    return this.request('proyectos', params);
  }

  async getProyecto(proyectoId: string): Promise<any> {
    return this.request(`proyectos/${proyectoId}`);
  }

  // ==================== MODERADORES ====================

  async getModeradores(params?: Record<string, any>): Promise<any[]> {
    return this.request('moderadores', params);
  }

  async getModerador(moderadorId: string): Promise<any> {
    return this.request(`moderadores/${moderadorId}`);
  }

  // ==================== CONVERSACIONES ====================

  async getConversaciones(params?: Record<string, any>): Promise<any[]> {
    return this.request('conversaciones', params);
  }

  async getConversacion(conversacionId: string): Promise<any> {
    return this.request(`conversaciones/${conversacionId}`);
  }

  // ==================== MENSAJES ====================

  async getMensajes(params?: Record<string, any>): Promise<any[]> {
    return this.request('mensajes', params);
  }

  async getMensaje(mensajeId: string): Promise<any> {
    return this.request(`mensajes/${mensajeId}`);
  }

  // ==================== NOTIFICACIONES ====================

  async getNotificaciones(params?: Record<string, any>): Promise<any[]> {
    return this.request('notificaciones', params);
  }

  async getNotificacion(notificacionId: string): Promise<any> {
    return this.request(`notificaciones/${notificacionId}`);
  }

  // ==================== SOLICITUDES PROYECTO ====================

  async getSolicitudesProyecto(params?: Record<string, any>): Promise<any[]> {
    return this.request('solicitudes_proyecto', params);
  }

  async getSolicitudProyecto(solicitudId: string): Promise<any> {
    return this.request(`solicitudes_proyecto/${solicitudId}`);
  }

  // ==================== AVANCES ====================

  async getAvances(params?: Record<string, any>): Promise<any[]> {
    return this.request('avances', params);
  }

  async getAvance(avanceId: string): Promise<any> {
    return this.request(`avances/${avanceId}`);
  }

  // ==================== INCIDENCIAS ====================

  async getIncidencias(params?: Record<string, any>): Promise<any[]> {
    return this.request('incidencias', params);
  }

  async getIncidencia(incidenciaId: string): Promise<any> {
    return this.request(`incidencias/${incidenciaId}`);
  }

  // ==================== VALORACIONES ====================

  async getValoraciones(params?: Record<string, any>): Promise<any[]> {
    return this.request('valoraciones', params);
  }

  async getValoracion(valoracionId: string): Promise<any> {
    return this.request(`valoraciones/${valoracionId}`);
  }

  // ==================== VERIFICACIONES ====================

  async getVerificaciones(params?: Record<string, any>): Promise<any[]> {
    return this.request('verificaciones', params);
  }

  async getVerificacion(verificacionId: string): Promise<any> {
    return this.request(`verificaciones/${verificacionId}`);
  }

  // ==================== IMÁGENES ====================

  async getImagenes(params?: Record<string, any>): Promise<any[]> {
    return this.request('imagenes', params);
  }

  async getImagen(imagenId: string): Promise<any> {
    return this.request(`imagenes/${imagenId}`);
  }

  // ==================== IMAGEN ASOCIACIONES ====================

  async getImagenAsociaciones(params?: Record<string, any>): Promise<any[]> {
    return this.request('imagen_asociaciones', params);
  }

  async getImagenAsociacion(asociacionId: string): Promise<any> {
    return this.request(`imagen_asociaciones/${asociacionId}`);
  }
}
