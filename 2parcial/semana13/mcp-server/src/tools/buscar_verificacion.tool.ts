/**
 * Tool: buscar_verificacion
 * 
 * Permite buscar una verificación por diversos criterios:
 * - ID de verificación
 * - ID de arquitecto
 * - Estado (pendiente, verificado, rechazado)
 * 
 * Realiza una consulta al microservicio-verificacion via REST
 * y retorna los datos de la verificación encontrada.
 */

import axios, { AxiosError } from 'axios';
import {
  MCPTool,
  JSONSchema,
  BuscarVerificacionResponse,
  Verificacion,
  JSONRPCErrorCode,
} from '../types/mcp.types.js';

/**
 * Función auxiliar para validar UUID
 */
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Esquema JSON de entrada para buscar_verificacion
 * Define los parámetros aceptados y sus validaciones
 */
const inputSchema: JSONSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'UUID de la verificación a buscar. Ej: 550e8400-e29b-41d4-a716-446655440000',
    },
    arquitecto_id: {
      type: 'string',
      description: 'UUID del arquitecto asociado. Ej: 550e8400-e29b-41d4-a716-446655440000',
    },
    estado: {
      type: 'string',
      description: 'Estado de la verificación: pendiente, verificado o rechazado',
      enum: ['pendiente', 'verificado', 'rechazado'],
    },
  },
  required: [],
  description: 'Al menos uno de los parámetros debe ser proporcionado (id, arquitecto_id, estado)',
  additionalProperties: false,
};

/**
 * Esquema JSON de salida para buscar_verificacion
 */
const outputSchema: JSONSchema = {
  type: 'object',
  properties: {
    found: {
      type: 'string',
      description: 'Indica si se encontró la verificación: true o false',
    },
    verificacion: {
      type: 'object',
      description: 'Datos de la verificación encontrada',
      properties: {
        id: { type: 'string' },
        arquitecto_id: { type: 'string' },
        moderador_id: { type: 'string' },
        estado: { type: 'string' },
        fecha_verificacion: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    },
    message: {
      type: 'string',
      description: 'Mensaje descriptivo del resultado',
    },
  },
  required: ['found', 'message'],
  additionalProperties: false,
};

/**
 * Función ejecutora del tool buscar_verificacion
 * 
 * Realiza una solicitud GET al backend REST para buscar la verificación
 * según los criterios proporcionados.
 */
const execute = async (
  params: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  // Validar que al menos un parámetro sea proporcionado
  if (!params.id && !params.arquitecto_id && !params.estado) {
    throw {
      code: JSONRPCErrorCode.VALIDATION_ERROR,
      message: 'Al menos uno de estos parámetros es requerido: id, arquitecto_id, estado',
    };
  }

  // Validar formato de UUIDs si se proporcionan
  if (params.id && typeof params.id === 'string' && !isValidUUID(params.id)) {
    throw {
      code: JSONRPCErrorCode.VALIDATION_ERROR,
      message: `ID de verificación inválido: "${params.id}". Debe ser un UUID válido`,
    };
  }

  if (params.arquitecto_id && typeof params.arquitecto_id === 'string' && !isValidUUID(params.arquitecto_id)) {
    throw {
      code: JSONRPCErrorCode.VALIDATION_ERROR,
      message: `ID de arquitecto inválido: "${params.arquitecto_id}". Debe ser un UUID válido`,
    };
  }

  // Validar y normalizar estado si se proporciona (aceptar mayúsculas y minúsculas)
  const estadosValidos = ['pendiente', 'verificado', 'rechazado'];
  let estadoNormalizado: string | undefined;
  if (params.estado) {
    estadoNormalizado = String(params.estado).toLowerCase();
    if (!estadosValidos.includes(estadoNormalizado)) {
      throw {
        code: JSONRPCErrorCode.VALIDATION_ERROR,
        message: `Estado inválido: "${params.estado}". Valores permitidos: ${estadosValidos.join(', ')}`,
      };
    }
  }

  try {
    // Construir URL del backend
    const baseUrl = process.env.VERIFICACION_SERVICE_URL || 'http://localhost:3002';
    let url = `${baseUrl}/api/verificacion/buscar`;

    // Construir query string con los parámetros
    const queryParams = new URLSearchParams();
    if (params.id) queryParams.append('id', String(params.id));
    if (params.arquitecto_id) queryParams.append('arquitectoId', String(params.arquitecto_id));
    if (estadoNormalizado) queryParams.append('estado', estadoNormalizado);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    console.log(`[buscar_verificacion] Realizando GET a: ${url}`);

    // Realizar solicitud al backend
    const timeout = parseInt(process.env.VERIFICACION_SERVICE_TIMEOUT || '5000', 10);
    const response = await axios.get<BuscarVerificacionResponse>(url, {
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Source': 'MCP-Server',
      },
    });

    console.log(`[buscar_verificacion] Respuesta exitosa:`, response.data);

    // Procesar respuesta - el backend ahora devuelve un array directamente
    const data = Array.isArray(response.data) ? response.data : (response.data as any).data || response.data;
    
    if (Array.isArray(data) && data.length > 0) {
      return {
        found: true,
        total: data.length,
        verificaciones: data,
        message: `Se encontraron ${data.length} verificación(es)`,
      };
    } else if (data && !Array.isArray(data) && data.id) {
      return {
        found: true,
        total: 1,
        verificaciones: [data],
        message: `Verificación encontrada: ${data.id}`,
      };
    } else {
      return {
        found: false,
        total: 0,
        verificaciones: [],
        message: 'No se encontraron verificaciones con los criterios proporcionados',
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<BuscarVerificacionResponse>;
    console.error(`[buscar_verificacion] Error:`, axiosError.message);

    if (axiosError.response?.status === 404) {
      return {
        found: false,
        verificacion: null,
        message: 'Verificación no encontrada',
      };
    }

    if (axiosError.code === 'ECONNREFUSED') {
      throw {
        code: JSONRPCErrorCode.BACKEND_ERROR,
        message: `No se puede conectar al microservicio de verificación en ${process.env.VERIFICACION_SERVICE_URL}. ¿Está el servicio corriendo en Docker?`,
      };
    }

    throw {
      code: JSONRPCErrorCode.BACKEND_ERROR,
      message: `Error al buscar verificación: ${axiosError.message}`,
      data: { status: axiosError.response?.status, error: axiosError.response?.data?.error },
    };
  }
};

/**
 * Definición completa del Tool buscar_verificacion
 */
export const buscarVerificacionTool: MCPTool = {
  name: 'buscar_verificacion',
  description:
    'Busca una verificación en la base de datos según criterios (ID, arquitecto_id o estado). ' +
    'Retorna los datos de la verificación si existe.',
  inputSchema,
  outputSchema,
  execute,
};
