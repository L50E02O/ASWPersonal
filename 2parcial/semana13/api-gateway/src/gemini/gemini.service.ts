/**
 * GeminiService - Integración con Google Generative AI
 * Maneja la comunicación con Gemini y ejecución de tools MCP
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  SchemaType,
  type FunctionDeclaration,
} from '@google/generative-ai';
import axios from 'axios';

/**
 * Interfaz para las definiciones de tools de MCP
 */
interface MCPTool {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

@Injectable()
export class GeminiService {
  private client: GoogleGenerativeAI;
  private mcpServerUrl: string;
  private readonly logger = new Logger(GeminiService.name);
  private tools: MCPTool[];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY no configurada. Gemini no funcionará sin ella.',
      );
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.mcpServerUrl =
      process.env.MCP_SERVER_URL || 'http://localhost:3500';

    // Inicializar tools de MCP
    this.initializeMCPTools();
  }

  /**
   * Inicializa las definiciones de tools de MCP
   */
  private initializeMCPTools() {
    this.tools = [
      {
        name: 'buscar_verificacion',
        description:
          'Busca verificaciones en el sistema según criterios específicos. ' +
          'Permite filtrar por ID único, arquitecto responsable, estado actual (PENDIENTE, VERIFICADO, RECHAZADO, EN_PROGRESO), ' +
          'y soporta paginación. Retorna una lista de verificaciones que coinciden con los criterios.',
        input_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description:
                'ID único de la verificación para búsqueda exacta. Si se proporciona, ignora otros criterios.',
            },
            arquitectoId: {
              type: 'string',
              description:
                'ID del arquitecto propietario de la verificación. Permite filtrar verificaciones por responsable.',
            },
            estado: {
              type: 'string',
              enum: ['PENDIENTE', 'VERIFICADO', 'RECHAZADO', 'EN_PROGRESO'],
              description:
                'Estado actual de la verificación. Usa: PENDIENTE (sin procesar), VERIFICADO (aprobado), ' +
                'RECHAZADO (no aprobado), EN_PROGRESO (siendo procesado).',
            },
            limit: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              description:
                'Número máximo de resultados a retornar. Rango: 1-100. Default: 10. Útil para paginación.',
            },
            offset: {
              type: 'number',
              minimum: 0,
              description:
                'Número de registros a saltar. Default: 0. Usa con limit para paginar.',
            },
          },
        },
      },
      {
        name: 'es_pendiente',
        description:
          'Verifica rápidamente si una verificación específica está en estado PENDIENTE. ' +
          'Retorna un booleano y el estado actual. Úsalo para validaciones antes de cambios de estado.',
        input_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description:
                'ID único de la verificación a validar. Requerido. Ejemplo: "verify-123".',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'cambiar_a_verificado',
        description:
          'Cambia el estado de una verificación a VERIFICADO. ' +
          'Requiere que esté en estado PENDIENTE o EN_PROGRESO. ' +
          'Opcionalmente acepta una razón para auditoría y trazabilidad. ' +
          'Retorna la verificación actualizada.',
        input_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description:
                'ID único de la verificación a actualizar. Requerido. Debe existir en el sistema.',
            },
            razon: {
              type: 'string',
              description:
                'Razón o comentario del cambio de estado para auditoría. ' +
                'Opcional. Registra quién y por qué cambió el estado.',
            },
          },
          required: ['id'],
        },
      },
    ];

    this.logger.log(
      `[GeminiService] Inicializado con ${this.tools.length} tools MCP`,
    );
  }

  /**
   * Obtiene las tools MCP para exponer a Gemini
   */
  getMCPTools() {
    return this.tools;
  }

  /**
   * Mapea tipos de schema JSON a SchemaType
   */
  private mapSchemaType(type: string): SchemaType {
    const typeMap: Record<string, SchemaType> = {
      string: SchemaType.STRING,
      number: SchemaType.NUMBER,
      integer: SchemaType.INTEGER,
      boolean: SchemaType.BOOLEAN,
      array: SchemaType.ARRAY,
      object: SchemaType.OBJECT,
    };
    return typeMap[type] || SchemaType.STRING;
  }

  /**
   * Ejecuta una tool MCP
   */
  private async executeMCPTool(
    toolName: string,
    params: Record<string, any>,
  ): Promise<any> {
    try {
      this.logger.debug(
        `[executeMCPTool] Ejecutando: ${toolName}`,
        JSON.stringify(params),
      );

      const response = await axios.post(
        `${this.mcpServerUrl}/rpc`,
        {
          jsonrpc: '2.0',
          id: `${toolName}-${Date.now()}`,
          method: 'tools.call',
          params: {
            name: toolName,
            params: params,
          },
        },
        { timeout: 15000 },
      );

      if (response.data.error) {
        this.logger.error(
          `[executeMCPTool] Error MCP: ${response.data.error.message}`,
        );
        throw new Error(`MCP Error: ${response.data.error.message}`);
      }

      this.logger.debug(
        `[executeMCPTool] Éxito: ${toolName}`,
        response.data.result,
      );
      return response.data.result;
    } catch (error: any) {
      this.logger.error(
        `[executeMCPTool] Error ejecutando ${toolName}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Procesa una solicitud de usuario con Gemini
   * Gemini decide automáticamente qué tools usar basado en la intención del usuario
   */
  async processUserRequest(userMessage: string): Promise<{
    response: string;
    toolsUsed: string[];
  }> {
    try {
      this.logger.log(
        `[processUserRequest] Procesando mensaje: "${userMessage.substring(0, 50)}..."`,
      );

      const model = this.client.getGenerativeModel({
        model: 'gemini-pro',
      });

      // Primera llamada: Gemini analiza el mensaje y decide qué tools usar
      const firstResponse = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
        tools: [
          {
            functionDeclarations: this.tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              parameters: {
                type: SchemaType.OBJECT,
                properties: Object.fromEntries(
                  Object.entries(tool.input_schema.properties).map(
                    ([key, value]: [string, any]) => [
                      key,
                      {
                        type: this.mapSchemaType(value.type),
                        description: value.description,
                        ...(value.enum ? { enum: value.enum } : {}),
                      },
                    ],
                  ),
                ),
                required: tool.input_schema.required || [],
              },
            })) as FunctionDeclaration[],
          },
        ],
      });

      const result = await firstResponse.response;
      const content = result.candidates?.[0]?.content;

      if (!content) {
        this.logger.warn('[processUserRequest] No hay contenido en respuesta');
        return {
          response: 'No se pudo procesar la solicitud.',
          toolsUsed: [],
        };
      }

      // Rastrear tools usadas
      const toolsUsed: string[] = [];

      // Si Gemini decidió ejecutar una tool
      if (content.parts.some((part) => 'functionCall' in part)) {
        this.logger.log('[processUserRequest] Gemini decidió ejecutar tools');

        const toolResults = [];

        // Ejecutar cada tool que Gemini solicitó
        for (const part of content.parts) {
          if ('functionCall' in part) {
            const functionCall = (part as any).functionCall;
            this.logger.log(
              `[processUserRequest] Ejecutando tool: ${functionCall.name}`,
            );

            toolsUsed.push(functionCall.name);

            try {
              const result = await this.executeMCPTool(
                functionCall.name,
                functionCall.args || {},
              );

              toolResults.push({
                functionResponse: {
                  name: functionCall.name,
                  response: result,
                },
              });
            } catch (error: any) {
              this.logger.error(
                `[processUserRequest] Error ejecutando tool ${functionCall.name}:`,
                error.message,
              );

              toolResults.push({
                functionResponse: {
                  name: functionCall.name,
                  response: {
                    error: error.message,
                  },
                },
              });
            }
          }
        }

        // Segunda llamada: Gemini procesa resultados y genera respuesta final
        this.logger.log(
          `[processUserRequest] Generando respuesta final con ${toolResults.length} resultados`,
        );

        const finalResponse = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
            {
              role: 'model',
              parts: content.parts,
            },
            {
              role: 'user',
              parts: toolResults,
            },
          ],
        });

        // Extraer texto de la respuesta final
        const finalResult = await finalResponse.response;
        const finalText = finalResult.candidates?.[0]?.content?.parts
          .filter((part) => 'text' in part)
          .map((part) => (part as any).text)
          .join('\n');

        this.logger.log('[processUserRequest] Respuesta final generada');
        return {
          response:
            finalText ||
            'No se pudo generar una respuesta adecuada.',
          toolsUsed,
        };
      }

      // Si Gemini no necesitó tools, retornar su respuesta directa
      this.logger.log('[processUserRequest] Respuesta directa de Gemini');
      const text = content.parts
        .filter((part) => 'text' in part)
        .map((part) => (part as any).text)
        .join('\n');

      return {
        response: text || 'Respuesta vacía de Gemini',
        toolsUsed,
      };
    } catch (error: any) {
      this.logger.error(
        '[processUserRequest] Error procesando solicitud:',
        error.message,
      );
      throw error;
    }
  }

  /**
   * Health check - verifica que Gemini y MCP Server estén disponibles
   */
  async healthCheck(): Promise<{ gemini: boolean; mcpServer: boolean }> {
    const results = {
      gemini: false,
      mcpServer: false,
    };

    // Verificar Gemini: verifica que la API key existe y que el cliente está inicializado
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && this.client) {
        // Verificar que el cliente está correctamente configurado
        results.gemini = true;
        this.logger.debug('[healthCheck] Gemini: OK');
      } else {
        this.logger.warn('[healthCheck] Gemini: API key no configurada o cliente no inicializado');
      }
    } catch (error) {
      this.logger.warn('[healthCheck] Gemini: Error en verificación', error);
    }

    // Verificar MCP Server: verifica que responde en /health
    try {
      const response = await axios.get(
        `${this.mcpServerUrl}/health`,
        { 
          timeout: 5000,
          validateStatus: (status) => status >= 200 && status < 500,
        },
      );
      results.mcpServer = response.status === 200;
      if (results.mcpServer) {
        this.logger.debug('[healthCheck] MCP Server: OK');
      } else {
        this.logger.warn(`[healthCheck] MCP Server: Respondió con status ${response.status}`);
      }
    } catch (error: any) {
      this.logger.warn(
        `[healthCheck] MCP Server no disponible: ${this.mcpServerUrl}`,
        error.message || error,
      );
      results.mcpServer = false;
    }

    return results;
  }
}
