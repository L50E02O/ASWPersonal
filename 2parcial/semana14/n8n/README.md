# n8n - Automatización de Workflows

Este directorio contiene la configuración Docker para n8n, una herramienta de automatización de workflows que permite crear flujos de trabajo visuales para integrar diferentes servicios.

## Configuración

### Credenciales de Acceso
- **Usuario**: `admin`
- **Contraseña**: `uleam2025`
- **Puerto**: `5678`
- **URL**: `http://localhost:5678`

### Variables de Entorno
- `N8N_BASIC_AUTH_USER`: Usuario para autenticación básica
- `N8N_BASIC_AUTH_PASSWORD`: Contraseña para autenticación básica
- `N8N_HOST`: Host usado para generar URLs públicas (localhost para OAuth2)
- `N8N_PORT`: Puerto donde escucha n8n (5678)
- `N8N_PROTOCOL`: Protocolo HTTP

## Inicio Rápido

### 1. Verificar que la red Docker existe

Primero, asegúrate de que la red `semana14_microservices-network` existe. Si no existe, créala:

```bash
docker network create semana14_microservices-network
```

O inicia primero el docker-compose principal que crea la red:

```bash
# Desde la raíz del proyecto semana14
docker-compose up -d
```

### 2. Iniciar n8n

```bash
# Desde la raíz del proyecto semana14
cd n8n
docker-compose up -d
```

**Nota**: La primera vez que ejecutes este comando, Docker descargará la imagen de n8n (aproximadamente 160MB), lo cual puede tomar unos minutos.

### 3. Verificar que n8n está corriendo

```bash
# Verificar el estado del contenedor
docker ps | findstr n8n

# Ver los logs si hay problemas
docker logs n8n-semana14
```

Deberías ver el contenedor `n8n-semana14` con estado `Up` y `(healthy)`.

### 4. Acceder a la Interfaz

Abre tu navegador en: `http://localhost:5678`

Inicia sesión con:
- Usuario: `admin`
- Contraseña: `uleam2025`

**Importante**: Espera unos segundos después de iniciar el contenedor para que n8n termine de inicializarse completamente.

### 3. Configurar Webhook en el Backend

Asegúrate de que el archivo `.env` del api-gateway tenga:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/unique-id
```

**Nota**: Reemplaza `unique-id` con el ID único que n8n te proporcionará cuando crees un nodo Webhook en tu workflow.

## Workflows Requeridos (Taller 4)

Según la rúbrica de evaluación, debes configurar 3 workflows dentro de la interfaz de n8n:

### 1. Workflow de Notificación
**Propósito**: Mensajes en tiempo real vía Telegram

**Nodos Clave**:
- Webhook (entrada)
- HTTP Request (Gemini) - para procesar el mensaje
- Telegram - para enviar notificaciones

**Eventos que activan**: `arquitecto.creado`, `verificacion.creada`, `arquitecto.actualizado`, `verificacion.actualizada`

### 2. Workflow de Sincronización
**Propósito**: Registro administrativo

**Nodos Clave**:
- Webhook (entrada)
- Google Sheets (Append) - para registrar datos

**Eventos que activan**: `arquitecto.creado`, `verificacion.creada`

### 3. Workflow de Alertas
**Propósito**: Evaluar condiciones críticas

**Nodos Clave**:
- Webhook (entrada)
- Gemini (Análisis) - para analizar el evento
- Switch (Urgencia) - para determinar el nivel de urgencia

**Eventos que activan**: `verificacion.creada`, `verificacion.actualizada`

## Estructura de Datos del Webhook

Cuando el backend emite un webhook, envía el siguiente formato JSON:

```json
{
  "evento": "arquitecto.creado",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": {
    "arquitecto": { /* datos del arquitecto creado */ },
    "datosCreacion": { /* DTO original */ }
  }
}
```

### Eventos Disponibles

- `arquitecto.creado`: Se emite cuando se crea un nuevo arquitecto
- `arquitecto.actualizado`: Se emite cuando se actualiza un arquitecto existente
- `verificacion.creada`: Se emite cuando se crea una nueva verificación
- `verificacion.actualizada`: Se emite cuando se actualiza una verificación existente

## Crear un Webhook en n8n

1. En la interfaz de n8n, crea un nuevo workflow
2. Arrastra el nodo **Webhook** al canvas
3. Configura el método HTTP como `POST`
4. Haz clic en **Listen for Test Event** para obtener la URL del webhook
5. Copia la URL completa (ej: `http://localhost:5678/webhook-test/abc123`)
6. Actualiza `N8N_WEBHOOK_URL` en el `.env` del api-gateway con esta URL
7. Reinicia el api-gateway para que cargue la nueva URL

## Volúmenes

Los datos de n8n (workflows, credenciales, etc.) se almacenan en el volumen `n8n_data` para persistencia entre reinicios del contenedor.

## Comandos Útiles

```bash
# Iniciar n8n
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener n8n
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Esto borra todos los workflows)
docker-compose down -v

# Reiniciar n8n
docker-compose restart
```

## Integración con el Proyecto

El servicio `WebhookEmitterService` en el api-gateway se encarga automáticamente de emitir webhooks cuando:

- Se crea un arquitecto (`POST /arquitectos`)
- Se actualiza un arquitecto (`PATCH /arquitectos/:id`)
- Se crea una verificación (`POST /verificaciones`)
- Se actualiza una verificación (`PATCH /verificaciones/:id`)

No es necesario hacer cambios adicionales en el código; los webhooks se emiten automáticamente después de operaciones exitosas.

## Solución de Problemas

### n8n no inicia
- Verifica que el puerto 5678 no esté en uso: `netstat -an | findstr 5678` (Windows) o `lsof -i :5678` (Linux/Mac)
- Revisa los logs: `docker-compose logs n8n`

### Webhooks no llegan a n8n
- Verifica que `N8N_WEBHOOK_URL` en el `.env` del api-gateway sea correcta
- Asegúrate de que el workflow en n8n esté activo (toggle en la esquina superior derecha)
- Revisa los logs del api-gateway para ver si hay errores al emitir webhooks

### Error de conexión a la red
- Asegúrate de que la red `microservices-network` exista: `docker network ls`
- Si no existe, créala: `docker network create microservices-network`
- O inicia primero el docker-compose principal que crea la red
