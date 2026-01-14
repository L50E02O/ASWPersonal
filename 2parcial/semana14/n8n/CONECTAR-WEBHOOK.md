# Cómo Conectar el Webhook de n8n con el Backend

## 📍 Ubicación de la Configuración

La URL del webhook se configura en el archivo `.env` del **api-gateway**.

## 🔧 Pasos para Conectar

### 1. Ubicación del Archivo

El archivo debe estar en:
```
2parcial/semana14/api-gateway/.env
```

### 2. Agregar la Variable

Abre el archivo `.env` y agrega o actualiza esta línea:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/notificacion
```

**⚠️ IMPORTANTE**: 
- **NO puedes editar la URL en n8n** - se genera automáticamente
- Si n8n muestra `0.0.0.0`, **es normal** (es la dirección interna del contenedor)
- **En el backend siempre usa `localhost`** en lugar de `0.0.0.0`
- `0.0.0.0` solo funciona dentro del contenedor Docker
- `localhost` funciona desde tu máquina local
- **Ver guía completa**: `workflows/POR-QUE-NO-EDITAR-URL.md`

### 3. Reiniciar el API Gateway

Después de actualizar el `.env`, necesitas reiniciar el api-gateway para que cargue la nueva configuración:

```bash
# Si está corriendo con npm/nest
# Detén el proceso (Ctrl+C) y vuelve a iniciarlo:
cd 2parcial/semana14/api-gateway
npm run start:dev

# O si está en Docker:
docker-compose restart api-gateway
```

## ✅ Verificar la Conexión

### 1. Verificar que el Webhook está Activo en n8n

1. Abre n8n: `http://localhost:5678`
2. Ve a tu workflow de notificación
3. Asegúrate de que el **toggle esté activo** (verde) en la esquina superior derecha
4. Click en el nodo **Webhook**
5. Verifica que diga "Active" o "Listening"

### 2. Probar desde el Backend

Crea o actualiza un arquitecto/verificación desde el API:

```bash
# Ejemplo: Crear un arquitecto
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Arquitecto",
    "email": "test@example.com"
  }'
```

### 3. Verificar en n8n

1. Ve a tu workflow en n8n
2. Click en el icono de **"Executions"** (historial) en la parte superior
3. Deberías ver una ejecución reciente con los datos del evento

### 4. Verificar Logs del Backend

En los logs del api-gateway deberías ver:

```
[WebhookEmitterService] Webhook emitido exitosamente: arquitecto.creado
```

O si hay error:

```
[WebhookEmitterService] Error al emitir webhook arquitecto.creado: ...
```

## 🔍 Solución de Problemas

### El webhook no se recibe en n8n

1. **Verifica que el workflow esté activo** en n8n
2. **Verifica la URL** en el `.env`:
   - Debe ser `http://localhost:5678/webhook-test/notificacion`
   - NO uses `0.0.0.0` desde fuera del contenedor
3. **Verifica que n8n esté corriendo**:
   ```bash
   docker ps | findstr n8n
   ```
4. **Revisa los logs del api-gateway** para ver errores

### Error de conexión

Si ves errores como "ECONNREFUSED" o "timeout":

1. Verifica que n8n esté accesible:
   ```bash
   curl http://localhost:5678/healthz
   ```

2. Verifica que el puerto 5678 no esté bloqueado por firewall

3. Si n8n está en Docker, verifica que el puerto esté mapeado:
   ```bash
   docker ps | findstr 5678
   ```

### El webhook se recibe pero no procesa

1. Verifica que el workflow tenga todos los nodos conectados correctamente
2. Revisa los logs de ejecución en n8n (icono de historial)
3. Verifica que las credenciales estén configuradas (Telegram, DeepSeek, etc.)

## 📝 Múltiples Webhooks

Si tienes múltiples workflows (Notificación, Sincronización, Alertas), puedes:

### Opción 1: Un solo Webhook Principal
- Configura `N8N_WEBHOOK_URL` con la URL del workflow principal
- Los otros workflows pueden escuchar el mismo webhook o usar triggers diferentes

### Opción 2: Múltiples URLs (Requiere Modificar el Servicio)
- Modificar `WebhookEmitterService` para enviar a múltiples URLs
- O crear instancias separadas del servicio

### Opción 3: Un Workflow que Distribuye
- Crear un workflow "distribuidor" que recibe el webhook y lo reenvía a otros workflows

## 🎯 Resumen Rápido

1. ✅ Edita `2parcial/semana14/api-gateway/.env`
2. ✅ Agrega: `N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/notificacion`
3. ✅ Reinicia el api-gateway
4. ✅ Activa el workflow en n8n
5. ✅ Prueba creando un arquitecto/verificación

¡Listo! El webhook debería estar conectado. 🚀
