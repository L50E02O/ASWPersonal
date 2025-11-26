import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class RestClientService implements OnModuleInit {
  private readonly logger = new Logger(RestClientService.name);
  private readonly baseUrl = "http://localhost:3000";

  constructor(private readonly httpService: HttpService) {}

  async onModuleInit() {
    // Verificar conexión al REST API al iniciar
    try {
      await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/usuarios`, { timeout: 3000 })
      );
      this.logger.log(`✅ Conexión exitosa con REST API en ${this.baseUrl}`);
    } catch (error: any) {
      this.logger.error(`❌ No se puede conectar al REST API en ${this.baseUrl}`);
      this.logger.error(`Asegúrate de que el REST API esté corriendo en el puerto 3000`);
      if (error.code === "ECONNREFUSED") {
        this.logger.error(`Error: Conexión rechazada - El servidor REST no está corriendo`);
      } else if (error.code === "ETIMEDOUT") {
        this.logger.error(`Error: Timeout - El servidor REST no responde`);
      } else {
        this.logger.error(`Error: ${error.message || error}`);
      }
    }
  }

  // Usuarios
  async getUsuarios(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/usuarios`)
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      const statusCode = error.response?.status || "N/A";
      this.logger.error(`Error al obtener usuarios (${statusCode}): ${errorMessage}`);
      if (error.code === "ECONNREFUSED") {
        throw new Error("No se puede conectar al REST API. Asegúrate de que esté corriendo en http://localhost:3000");
      }
      throw error;
    }
  }

  async getUsuarioById(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/usuarios/${id}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  }

  async getUsuarioByEmail(correo: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/usuarios/email/${correo}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener usuario por email ${correo}:`, error);
      throw error;
    }
  }

  // Conferencias
  async getConferencias(estado?: string): Promise<any[]> {
    try {
      const url = estado
        ? `${this.baseUrl}/conferencias?estado=${estado}`
        : `${this.baseUrl}/conferencias`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      const statusCode = error.response?.status || "N/A";
      this.logger.error(`Error al obtener conferencias (${statusCode}): ${errorMessage}`);
      if (error.code === "ECONNREFUSED") {
        throw new Error("No se puede conectar al REST API. Asegúrate de que esté corriendo en http://localhost:3000");
      }
      throw error;
    }
  }

  async getConferenciaById(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/conferencias/${id}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener conferencia ${id}:`, error);
      throw error;
    }
  }

  async getConferenciasDisponibles(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/conferencias/disponibles`)
      );
      return response.data;
    } catch (error) {
      this.logger.error("Error al obtener conferencias disponibles:", error);
      throw error;
    }
  }

  // Agendas
  async getAgendas(usuarioId?: string, conferenciaId?: string, estado?: string): Promise<any[]> {
    try {
      let url = `${this.baseUrl}/agendas`;
      const params = new URLSearchParams();
      if (usuarioId) params.append("usuarioId", usuarioId);
      if (conferenciaId) params.append("conferenciaId", conferenciaId);
      if (estado) params.append("estado", estado);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      const statusCode = error.response?.status || "N/A";
      this.logger.error(`Error al obtener agendas (${statusCode}): ${errorMessage}`);
      if (error.code === "ECONNREFUSED") {
        throw new Error("No se puede conectar al REST API. Asegúrate de que esté corriendo en http://localhost:3000");
      }
      throw error;
    }
  }

  async getAgendaById(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/agendas/${id}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener agenda ${id}:`, error);
      throw error;
    }
  }
}

