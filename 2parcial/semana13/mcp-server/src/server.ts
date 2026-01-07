/**/**


export { app };}  startServer();if (require.main === module) {// Iniciar si se ejecuta directamente}  }    process.exit(1);    console.error('[Server] Error iniciando servidor:', error);  } catch (error) {    });      `);╚════════════════════════════════════════════════════════╝║    GET  /health             - Health check             ║║    GET  /tools              - Lista tools              ║║    POST /rpc                - Solicitudes JSON-RPC     ║║    GET  /                   - Info general             ║║ 📚 Endpoints:                                          ║║                                                        ║║    • cambiar_a_verificado                              ║║    • es_pendiente                                      ║║    • buscar_verificacion                               ║║ 🔧 Tools disponibles:                                  ║║ 📡 Protocolo: JSON-RPC 2.0                             ║║ 🚀 Servidor escuchando en: http://localhost:${PORT}        ║╠════════════════════════════════════════════════════════╣║           MCP Server iniciado                          ║╔════════════════════════════════════════════════════════╗      console.log(`    app.listen(PORT, () => {    }      console.log('[Server] ✓ Backend conectado exitosamente');    } else {      console.warn('[Server] El servidor iniciará pero las tools fallarán.');      console.warn(`[Server] Backend URL: ${process.env.BACKEND_BASE_URL || 'http://localhost:3001'}`);      );        '[Server] ⚠️ Advertencia: No se pudo conectar con el backend.',      console.warn(    if (!backendReady) {    const backendReady = await backendClient.healthCheck();    console.log('[Server] Verificando conectividad con backend...');    // Verificar conectividad con backend antes de iniciar  try {async function startServer() { */ * Inicia el servidor/**});  });    message: err.message,    error: 'Error interno del servidor',    success: false,  res.status(500).json({  console.error('[Unhandled Error]:', err);app.use((err: any, req: Request, res: Response, next: any) => { */ * Manejo global de errores/**});  });    },      health: 'GET /health',      tools: 'GET /tools',      rpc: 'POST /rpc',      root: 'GET /',    availableEndpoints: {    error: `Ruta no encontrada: ${req.method} ${req.path}`,    success: false,  res.status(404).json({app.use((req: Request, res: Response) => { */ * Manejo de rutas no encontradas/**});  });    },      },        description: 'Health check del servidor',        path: '/health',        method: 'GET',      health: {      },        description: 'Lista todas las tools disponibles',        path: '/tools',        method: 'GET',      tools: {      },        description: 'Procesa solicitudes JSON-RPC 2.0',        path: '/rpc',        method: 'POST',      rpc: {    endpoints: {      'Servidor MCP que expone tools para gestión de verificaciones. Integrable con Gemini y otros clientes MCP.',    description:    protocol: 'JSON-RPC 2.0',    version: '1.0.0',    name: 'MCP Server - Verificación',  res.json({app.get('/', (req: Request, res: Response) => { */ * GET / - Root endpoint con información general/**});  }    });      timestamp: new Date().toISOString(),      error: error.message,      status: 'unhealthy',      success: false,    res.status(503).json({  } catch (error: any) {    });      },        count: getAllTools().length,        registered: getToolNames(),      tools: {      },        status: backendHealthy ? 'connected' : 'unreachable',        url: process.env.BACKEND_BASE_URL || 'http://localhost:3001',      backend: {      },        protocol: 'JSON-RPC 2.0',        port: PORT,        version: '1.0.0',      server: {      timestamp: new Date().toISOString(),      status: 'healthy',      success: true,    res.json({    const backendHealthy = await backendClient.healthCheck();    // Verificar conectividad con el backend  try {app.get('/health', async (req: Request, res: Response) => { */ * Health check del servidor y conectividad con backend * GET /health/**});  }    });      timestamp: new Date().toISOString(),      error: error.message,      success: false,    res.status(500).json({  } catch (error: any) {    });      timestamp: new Date().toISOString(),      tools: descriptions,      count: tools.length,      success: true,    res.json({    const descriptions = describeAllTools();    const tools = getAllTools();  try {app.get('/tools', (req: Request, res: Response) => { */ * Retorna información detallada de cada tool (nombre, descripción, schema de inputs) * Lista todas las tools disponibles en el servidor * GET /tools/**});  }    );      ),        'Error parseando JSON-RPC: ' + error.message,        JSONRPCErrorCode.PARSE_ERROR,        null,      createErrorResponse(    return res.status(400).json(    console.error('[RPC Parser Error]:', error);  } catch (error: any) {    }      );        ),          `Error ejecutando tool ${request.method}: ${executionError.message}`,          JSONRPCErrorCode.INTERNAL_ERROR,          request.id,        createErrorResponse(      return res.status(500).json(      console.error(`[RPC Execution Error] ${request.method}:`, executionError);    } catch (executionError: any) {      return res.json(createSuccessResponse(request.id, result));      console.log(`[RPC Response] Method: ${request.method}, Success: ${result.success}`);      const result = await tool.execute(request.params || {});    try {    // Ejecutar la tool    }      );        ),          },            availableTools: getToolNames(),          {          `Tool no encontrada: ${request.method}`,          JSONRPCErrorCode.METHOD_NOT_FOUND,          request.id,        createErrorResponse(      return res.status(400).json(    if (!tool) {    const tool = getTool(request.method);    // Obtener la tool    );      request.params,      `[RPC Request] Method: ${request.method}, ID: ${request.id}`,    console.log(    }      );        ),          'Campo "id" es requerido',          JSONRPCErrorCode.INVALID_REQUEST,          null,        createErrorResponse(      return res.status(400).json(    if (request.id === undefined || request.id === null) {    // Validar que haya un ID    }      );        ),          'Campo "method" es requerido y debe ser string',          JSONRPCErrorCode.INVALID_REQUEST,          request.id || null,        createErrorResponse(      return res.status(400).json(    if (!request.method || typeof request.method !== 'string') {    // Validar que haya un método    }      );        ),          'Versión JSON-RPC inválida. Debe ser "2.0"',          JSONRPCErrorCode.INVALID_REQUEST,          request.id || null,        createErrorResponse(      return res.status(400).json(    if (!request.jsonrpc || request.jsonrpc !== '2.0') {    // Validar que sea JSON-RPC 2.0    const request = req.body as JSONRPCRequest;  try {app.post('/rpc', async (req: Request, res: Response) => { */ * Ejecuta la tool correspondiente y retorna el resultado * Procesa solicitudes JSON-RPC 2.0 * POST /rpc/**}  };    result,    id,    jsonrpc: '2.0',  return {function createSuccessResponse(id: string | number, result: any): JSONRPCResponse { */ * Crea una respuesta JSON-RPC 2.0 exitosa/**}  } as any;    },      data,      message,      code,    error: {    id: id === null ? undefined : id,    jsonrpc: '2.0',  return {): JSONRPCResponse {  data?: any,  message: string,  code: number,  id: string | number | null,function createErrorResponse( */ * Crea una respuesta JSON-RPC 2.0 de error/**});  next();  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);app.use((req, res, next) => {// Logger middlewareapp.use(express.json());// Middlewareconst PORT = parseInt(process.env.MCP_SERVER_PORT || '9000');const app = express();dotenv.config();// Cargar variables de entornoimport { backendClient } from './services/backend-client';} from './tools/registry';  describeAllTools,  getToolNames,  getAllTools,  getTool,import {} from './types/mcp.types';  JSONRPCErrorCode,  JSONRPCResponse,  JSONRPCRequest,import {import dotenv from 'dotenv';import express, { Request, Response } from 'express'; */ * - GET /health - Health check * - GET /tools - Lista las tools disponibles * - POST /rpc - Procesa solicitudes JSON-RPC 2.0 * Endpoints: * * Expone las tools de verificación para consumo por Gemini u otros clientes MCP * Servidor que implementa Model Context Protocol mediante JSON-RPC 2.0 * * MCP Server - Express + JSON-RPC 2.0 * MCP Server - Servidor JSON-RPC 2.0
 * 
 * Implementación de un servidor Model Context Protocol (MCP) usando Express
 * que expone tools mediante JSON-RPC 2.0.
 * 
 * Métodos soportados:
 * - tools.list: Obtiene lista de tools disponibles
 * - tools.call: Ejecuta un tool específico
 * - tools.describe: Obtiene esquema detallado de un tool
 * 
 * Basado en: https://spec.modelcontextprotocol.io/
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  JSONRPCRequest,
  JSONRPCSuccessResponse,
  JSONRPCErrorResponse,
  JSONRPCErrorCode,
} from './types/mcp.types.js';
import { getAllTools, getToolByName, getToolNames, isValidToolName, listTools } from './tools/registry.js';

// Configuración del servidor desde variables de entorno
const PORT = parseInt(process.env.MCP_SERVER_PORT || '3500', 10);
const HOST = process.env.MCP_SERVER_HOST || '0.0.0.0';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

/**
 * Función de logging
 */
const log = {
  info: (message: string, data?: any) => {
    if (['info', 'debug'].includes(LOG_LEVEL)) {
      console.log(`[${new Date().toISOString()}] INFO: ${message}`, data || '');
    }
  },
  debug: (message: string, data?: any) => {
    if (LOG_LEVEL === 'debug') {
      console.log(`[${new Date().toISOString()}] DEBUG: ${message}`, data || '');
    }
  },
  error: (message: string, data?: any) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, data || '');
  },
};

/**
 * Crear aplicación Express
 */
const app: Express = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ limit: '10mb' }));

/**
 * Middleware de logging de requests
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  log.debug(`${req.method} ${req.path}`, { body: req.body });
  next();
});

/**
 * Manejador de JSON-RPC
 * 
 * Validaciones:
 * - jsonrpc === "2.0"
 * - method es requerido
 * - Errores retornan status 200 (por spec JSON-RPC 2.0)
 */
const handleJsonRpc = async (req: Request, res: Response): Promise<void> => {
  const request = req.body as JSONRPCRequest;

  // Validar estructura JSON-RPC básica
  if (request.jsonrpc !== '2.0') {
    log.warn('Request con versión JSON-RPC inválida');
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: JSONRPCErrorCode.INVALID_REQUEST,
        message: 'JSON-RPC version must be "2.0"',
      },
      id: request.id || null,
    });
    return;
  }

  // Validar que method existe
  if (!request.method) {
    log.warn('Request sin method');
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: JSONRPCErrorCode.INVALID_REQUEST,
        message: 'Missing required field: method',
      },
      id: request.id || null,
    });
    return;
  }

  const requestId = request.id || uuidv4();
  log.info(`Processing JSON-RPC request: ${request.method}`, { id: requestId });

  try {
    let result: any;

    // Enrutamiento de métodos RPC
    switch (request.method) {
      case 'tools.list':
        result = handleToolsList();
        break;

      case 'tools.describe':
        result = handleToolsDescribe(request.params);
        break;

      case 'tools.call':
        result = await handleToolsCall(request.params);
        break;

      case 'tools.all':
        result = handleToolsAll();
        break;

      case 'ping':
        result = { status: 'pong', timestamp: new Date().toISOString() };
        break;

      case 'health':
        result = {
          status: 'healthy',
          tools_count: getAllTools().length,
          timestamp: new Date().toISOString(),
        };
        break;

      default:
        res.status(200).json({
          jsonrpc: '2.0',
          error: {
            code: JSONRPCErrorCode.METHOD_NOT_FOUND,
            message: `Method not found: ${request.method}`,
            data: { availableMethods: ['tools.list', 'tools.call', 'tools.describe', 'tools.all', 'ping', 'health'] },
          },
          id: requestId,
        } as JSONRPCErrorResponse);
        return;
    }

    // Respuesta exitosa
    const response: JSONRPCSuccessResponse = {
      jsonrpc: '2.0',
      result,
      id: requestId,
    };

    log.info(`JSON-RPC response successful: ${request.method}`, { id: requestId });
    res.status(200).json(response);
  } catch (error) {
    // Manejo de errores

    let errorCode = JSONRPCErrorCode.INTERNAL_ERROR;
    let errorMessage = 'Internal server error';
    let errorData: any = undefined;

    if (typeof error === 'object' && error !== null) {
      const err = error as any;

      if (err.code && typeof err.code === 'number') {
        errorCode = err.code;
      }

      if (err.message && typeof err.message === 'string') {
        errorMessage = err.message;
      }

      if (err.data) {
        errorData = err.data;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    log.error(`JSON-RPC error: ${request.method}`, { errorCode, errorMessage, id: requestId });

    const errorResponse: JSONRPCErrorResponse = {
      jsonrpc: '2.0',
      error: {
        code: errorCode,
        message: errorMessage,
        ...(errorData && { data: errorData }),
      },
      id: requestId,
    };

    res.status(200).json(errorResponse);
  }
};

/**
 * Manejador: tools.list
 * Retorna lista de tools disponibles (nombres y descripciones)
 */
const handleToolsList = (): any => {
  return {
    tools: getToolNames(),
    count: getAllTools().length,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Manejador: tools.all
 * Retorna información completa de todos los tools (incluyendo schemas)
 */
const handleToolsAll = (): any => {
  return {
    tools: listTools(),
    count: getAllTools().length,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Manejador: tools.describe
 * Retorna esquema detallado de un tool específico
 */
const handleToolsDescribe = (params?: Record<string, unknown>): any => {
  if (!params?.name || typeof params.name !== 'string') {
    throw {
      code: JSONRPCErrorCode.INVALID_PARAMS,
      message: 'Missing required parameter: name (string)',
    };
  }

  const toolName = params.name as string;

  if (!isValidToolName(toolName)) {
    throw {
      code: JSONRPCErrorCode.SERVER_ERROR,
      message: `Tool not found: ${toolName}`,
      data: { availableTools: getToolNames() },
    };
  }

  const tool = getToolByName(toolName);
  if (!tool) {
    throw {
      code: JSONRPCErrorCode.INTERNAL_ERROR,
      message: `Could not retrieve tool: ${toolName}`,
    };
  }

  return {
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    outputSchema: tool.outputSchema,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Manejador: tools.call
 * Ejecuta un tool específico con los parámetros proporcionados
 * 
 * Parámetros requeridos:
 * - name: string - Nombre del tool
 * - params: object - Parámetros para el tool
 */
const handleToolsCall = async (params?: Record<string, unknown>): Promise<any> => {
  if (!params?.name || typeof params.name !== 'string') {
    throw {
      code: JSONRPCErrorCode.INVALID_PARAMS,
      message: 'Missing required parameter: name (string)',
    };
  }

  const toolName = params.name as string;

  if (!isValidToolName(toolName)) {
    throw {
      code: JSONRPCErrorCode.SERVER_ERROR,
      message: `Tool not found: ${toolName}`,
      data: { availableTools: getToolNames() },
    };
  }

  const tool = getToolByName(toolName);
  if (!tool) {
    throw {
      code: JSONRPCErrorCode.INTERNAL_ERROR,
      message: `Could not retrieve tool: ${toolName}`,
    };
  }

  // Obtener parámetros del tool (pueden no estar presentes)
  const toolParams = (params.params as Record<string, unknown>) || {};

  log.debug(`Executing tool: ${toolName}`, { params: toolParams });

  try {
    // Ejecutar el tool
    const result = await tool.execute(toolParams);

    return {
      tool: toolName,
      result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Los tools lanzan objetos con code y message
    // Si es un error ya formateado, re-lanzarlo
    if (typeof error === 'object' && error !== null && (error as any).code) {
      throw error;
    }

    // Si es un error genérico, envolverlo
    throw {
      code: JSONRPCErrorCode.SERVER_ERROR,
      message: `Error executing tool ${toolName}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Endpoint: POST /rpc
 * Principal endpoint para JSON-RPC 2.0
 */
app.post('/rpc', handleJsonRpc);

/**
 * Endpoint: GET /health
 * Health check simple (no JSON-RPC)
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'MCP Server - Verificación',
    version: '1.0.0',
    tools: getToolNames(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint: GET /tools
 * Información de todos los tools disponibles
 */
app.get('/tools', (req: Request, res: Response) => {
  res.status(200).json({
    tools: listTools(),
    count: getAllTools().length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint: GET /
 * Información del servidor
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'MCP Server - Verificación',
    description: 'Model Context Protocol Server para gestión de Verificaciones',
    version: '1.0.0',
    protocol: 'JSON-RPC 2.0',
    endpoints: {
      rpc: 'POST /rpc',
      health: 'GET /health',
      tools: 'GET /tools',
    },
    tools: getToolNames(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Manejo de rutas no encontradas
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

/**
 * Iniciar servidor
 */
const startServer = (): void => {
  app.listen(PORT, HOST, () => {
    log.info(`=================================================`);
    log.info(`MCP Server iniciado`);
    log.info(`Host: ${HOST}`);
    log.info(`Puerto: ${PORT}`);
    log.info(`URL: http://${HOST}:${PORT}`);
    log.info(`Tools registrados: ${getAllTools().length}`);
    log.info(`=================================================`);

    // Listar tools disponibles
    getToolNames().forEach((toolName) => {
      const tool = getToolByName(toolName);
      if (tool) {
        log.info(`  ✓ ${toolName} - ${tool.description}`);
      }
    });

    log.info(`=================================================`);
    log.info(`Endpoints disponibles:`);
    log.info(`  POST   /rpc      - JSON-RPC 2.0 endpoint`);
    log.info(`  GET    /health   - Health check`);
    log.info(`  GET    /tools    - Lista de tools`);
    log.info(`  GET    /         - Información del servidor`);
    log.info(`=================================================`);
  });
};

// Iniciar servidor
startServer();

export default app;
