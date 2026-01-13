# 🚀 Guía Completa: Configurar n8n de Cero a Funcionando

## 📋 Checklist General

- [ ] n8n está corriendo en Docker
- [ ] 3 workflows importados en n8n
- [ ] Credenciales configuradas (DeepSeek, Telegram, Google Sheets)
- [ ] Workflows activados
- [ ] URLs de webhooks obtenidas
- [ ] Backend configurado con las URLs
- [ ] Todo funcionando y probado

---

## PASO 1: Verificar que n8n está Corriendo ✅

```bash
# Verificar contenedor
docker ps | findstr n8n

# Si no está corriendo:
cd 2parcial\semana14\n8n
docker-compose up -d
```

**Abre en el navegador**: `http://localhost:5678`
- Usuario: `admin`
- Contraseña: `uleam2025`

---

## PASO 2: Importar los 3 Workflows 📥

1. En n8n, click en **"Workflows"** (menú izquierdo)
2. Click en **"Import from File"**
3. Importa estos 3 archivos (uno por uno):
   - `1-notificacion-telegram.json`
   - `2-sincronizacion-google-sheets.json`
   - `3-alertas-gemini-switch.json`

**✅ Deberías ver 3 workflows en tu lista**

---

## PASO 3: Configurar Workflow 1 - Notificación Telegram 📱

### 3.1 Configurar DeepSeek API Key

1. Abre el workflow **"Notificación Telegram - Eventos del Sistema"**
2. Click en el nodo **"Set - Configuración"** (segundo nodo)
3. En el campo `DEEPSEEK_API_KEY`:
   - Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key real
   - Obtener API key: https://platform.deepseek.com/ → API Keys → Crear
4. En el campo `TELEGRAM_CHAT_ID`:
   - Reemplaza `TU_CHAT_ID_DE_TELEGRAM_AQUI` con tu Chat ID
   - Obtener Chat ID: Envía mensaje a tu bot → Visita `https://api.telegram.org/bot<TU_BOT_TOKEN>/getUpdates` → Busca `"chat":{"id":123456789}`
5. **Guarda el workflow** (Ctrl+S o icono de guardar)

### 3.2 Configurar Credencial de Telegram

1. Click en el nodo **"Telegram - Enviar Mensaje"**
2. En "Credential to connect with", click en **"Create New Credential"**
3. Selecciona **"Telegram"**
4. Pega tu **Bot Token** (obtener de @BotFather en Telegram)
5. Guarda la credencial

### 3.3 Obtener URL del Webhook

1. Click en el nodo **"Webhook - Notificación"**
2. Click en el botón rojo **"Listen for test event"**
3. **Copia la URL** que aparece (ej: `http://0.0.0.0:5678/webhook-test/notificacion`)
   - ⚠️ NO te preocupes por el `0.0.0.0`, lo cambiaremos en el backend
4. **Guarda esta URL** para el Paso 7

### 3.4 Activar el Workflow

1. **Activar el workflow**:
   - Busca el **toggle/switch** en la esquina superior derecha del editor (cerca del botón "Save")
   - Si está **gris o inactivo**, haz click para activarlo
   - Debe quedar **verde o activo** (el toggle cambia de color)
   - Cuando está activo, verás el mensaje "Waiting for trigger event" en la barra inferior (esto es normal)

2. **Guardar el workflow**:
   - Click en el botón **"Save"** (botón rojo en la esquina superior derecha)
   - O presiona `Ctrl+S` (Windows) / `Cmd+S` (Mac)

**✅ Workflow 1 listo y activo**

**Verificación**: Si el workflow está activo, verás:
- El toggle en verde/activo
- El mensaje "Waiting for trigger event" en la parte inferior (esto es normal - significa que está esperando recibir webhooks)

---

## PASO 4: Configurar Workflow 2 - Sincronización Google Sheets 📊

### 4.1 Configurar Google Sheets Document ID

1. Abre el workflow **"Sincronización Google Sheets - Registro Administrativo"**
2. Click en el nodo **"Set - Configuración"**
3. En el campo `GOOGLE_SHEETS_DOCUMENT_ID`:
   - Reemplaza `TU_GOOGLE_SHEETS_DOCUMENT_ID_AQUI` con el ID de tu Google Sheet
   - **Cómo obtener el ID**: 
     - Abre tu Google Sheet
     - Mira la URL: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
     - El ID es: `ABC123XYZ` (lo que está entre `/d/` y `/edit`)
4. **Guarda el workflow**

### 4.2 Configurar Credencial de Google Sheets

1. Click en el nodo **"Google Sheets - Append"**
2. En "Credential to connect with", click en **"Create New Credential"**
3. Selecciona **"Google Sheets OAuth2 API"**

4. **Obtener Client ID y Client Secret**:
   - Ve a: https://console.cloud.google.com/
   - Crea un proyecto nuevo (si no tienes)
   - Habilita: "Google Sheets API" y "Google Drive API"
   - Ve a: Credenciales → Crear → OAuth client ID
   - Si aparece la pantalla de configuración de pantalla de consentimiento:
     - **Paso "Público"**: Selecciona **"Usuarios externos"** (External users)
       - ✅ **Usa "Usuarios externos"** para proyectos personales/académicos
       - ❌ "Interno" solo es para organizaciones de Google Workspace
     - Agrega tu email como "Usuario de prueba" en el paso correspondiente
   - **Tipo de aplicación**: Selecciona **"Aplicación web"** (ya debería estar seleccionado)
   - **Nombre**: Puedes cambiar "Cliente web 1" a "n8n Google Sheets" (opcional)
   - **URIs de redireccionamiento autorizados** (Authorized redirect URIs):
     - Click en el botón **"+ Agregar URI"** (está en la sección "URIs de redireccionamiento autorizados")
     - Ingresa: `http://localhost:5678/rest/oauth2-credential/callback`
     - ⚠️ **IMPORTANTE**: Usa `localhost`, NO uses `0.0.0.0`
   - **NO necesitas llenar** "Orígenes autorizados de JavaScript" (déjalo vacío)
   - Click en **"Crear"** o **"Create"**
   - **Copia Client ID y Client Secret** (aparecerán en un diálogo)image.png

5. **En n8n**:
   - Pega el **Client ID** en el campo "Client ID"
   - Pega el **Client Secret** en el campo "Client Secret"
   - Verifica que OAuth Redirect URL sea: `http://localhost:5678/rest/oauth2-credential/callback`
   - ⚠️ Si dice `0.0.0.0`, cámbialo a `localhost`
   - Click en **"Save"**

6. **Autorizar**:
   - Click en el botón azul **"Sign in with Google"**
   - Selecciona tu cuenta de Google
   - Click en "Permitir"
   - ✅ Debería mostrar que la conexión fue exitosa
   - ⚠️ **Si ves "Access blocked: Authorization Error"**: 
     - Verifica que el OAuth Redirect URL en n8n use `localhost` (no `0.0.0.0`)
     - Verifica que en Google Cloud Console también use `localhost`
     - Ver guía: `SOLUCION-ERROR-ACCESS-BLOCKED.md`

### 4.3 Obtener URL del Webhook

1. Click en el nodo **"Webhook - Sincronización"**
2. Click en **"Listen for test event"**
3. **Copia la URL** (ej: `http://0.0.0.0:5678/webhook-test/sincronizacion`)
4. **Guarda esta URL** para el Paso 7

### 4.4 Activar el Workflow

1. **Activar el workflow**:
   - Busca el **toggle/switch** en la esquina superior derecha
   - Click para activarlo (debe quedar verde/activo)
   - Verás "Waiting for trigger event" en la parte inferior (normal)

2. **Guardar el workflow**: Click en **"Save"** o `Ctrl+S`

**✅ Workflow 2 listo y activo**

---

## PASO 5: Configurar Workflow 3 - Alertas ⚠️

### 5.1 Configurar DeepSeek API Key

1. Abre el workflow **"Alertas - Evaluación de Condiciones Críticas"**
2. Click en el nodo **"Set - Configuración"**
3. En el campo `DEEPSEEK_API_KEY`:
   - Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key (la misma del Workflow 1)
4. **Guarda el workflow**

### 5.2 Obtener URL del Webhook

1. Click en el nodo **"Webhook - Alertas"**
2. Click en **"Listen for test event"**
3. **Copia la URL** (ej: `http://0.0.0.0:5678/webhook-test/alertas`)
4. **Guarda esta URL** para el Paso 7

### 5.3 Activar el Workflow

1. **Activar el workflow**:
   - Busca el **toggle/switch** en la esquina superior derecha
   - Click para activarlo (debe quedar verde/activo)
   - Verás "Waiting for trigger event" en la parte inferior (normal)

2. **Guardar el workflow**: Click en **"Save"** o `Ctrl+S`

**✅ Workflow 3 listo y activo**

---

## PASO 6: Verificar que Todos los Workflows Están Activos 🟢

1. En la lista de workflows, verifica que los 3 tengan el **toggle verde/activo**
2. Si alguno está inactivo, actívalo

**✅ Todos los workflows deben estar activos**

---

## PASO 7: Configurar el Backend (API Gateway) 🔧

### 7.1 Crear Archivo .env

1. Ve a la carpeta: `2parcial\semana14\api-gateway\`
2. Crea un archivo llamado `.env` (si no existe)
3. Copia el contenido de `env.example` y agrega:

```env
# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
RABBITMQ_QUEUE_ARQUITECTO=arquitecto.queue
RABBITMQ_QUEUE_VERIFICACION=verificacion.queue

# Application
PORT=3000
NODE_ENV=development

# MCP Server
MCP_SERVER_URL=http://localhost:3500

# Gemini API (opcional)
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-pro

# n8n Webhook
# IMPORTANTE: Cambia 0.0.0.0 por localhost
# Elige la URL del workflow que quieras usar como principal
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/notificacion
```

**⚠️ IMPORTANTE**:
- Reemplaza `/notificacion` con la URL que copiaste del workflow que quieras usar
- **SIEMPRE usa `localhost`** en lugar de `0.0.0.0`
- Ejemplo: Si copiaste `http://0.0.0.0:5678/webhook-test/sincronizacion`, escribe: `http://localhost:5678/webhook-test/sincronizacion`

### 7.2 Reiniciar el API Gateway

```bash
cd 2parcial\semana14\api-gateway

# Si está corriendo, deténlo (Ctrl+C) y vuelve a iniciarlo:
npm run start:dev
```

**✅ Backend configurado**

---

## PASO 8: Probar que Todo Funciona 🧪

### 8.1 Verificar Logs del Backend

En los logs del api-gateway deberías ver:
```
[WebhookEmitterService] WebhookEmitterService inicializado. URL: http://localhost:5678/webhook-test/notificacion
```

### 8.2 Crear un Evento de Prueba

**Opción A: Crear un Arquitecto**
```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Arquitecto Prueba",
    "email": "test@example.com"
  }'
```

**Opción B: Desde Postman/Thunder Client**
- POST `http://localhost:3000/arquitectos`
- Body JSON:
```json
{
  "nombre": "Arquitecto Prueba",
  "email": "test@example.com"
}
```

### 8.3 Verificar en n8n

1. Ve a n8n: `http://localhost:5678`
2. Abre el workflow correspondiente
3. Click en el icono de **"Executions"** (historial) en la parte superior
4. **Deberías ver una ejecución reciente** con los datos del evento

### 8.4 Verificar Resultados

- **Workflow 1**: Revisa Telegram - deberías recibir un mensaje
- **Workflow 2**: Revisa tu Google Sheet - debería agregarse una fila
- **Workflow 3**: Revisa los logs de ejecución - debería analizar el evento

**✅ Todo funcionando**

---

## 🔍 Solución de Problemas Rápida

### ❌ El webhook no se recibe en n8n

- ✅ Verifica que el workflow esté **activo** (toggle verde)
- ✅ Verifica que la URL en `.env` use `localhost` (no `0.0.0.0`)
- ✅ Verifica que n8n esté corriendo: `docker ps | findstr n8n`
- ✅ Revisa los logs del backend para ver errores

### ❌ Error 400 en Google OAuth

- ✅ Verifica que el Redirect URI en Google Cloud Console sea: `http://localhost:5678/rest/oauth2-credential/callback`
- ✅ Verifica que en n8n también use `localhost` (no `0.0.0.0`)
- ✅ Verifica que las APIs (Sheets y Drive) estén habilitadas

### ❌ Error al enviar a Telegram

- ✅ Verifica que el Bot Token sea correcto
- ✅ Verifica que el Chat ID sea correcto
- ✅ Verifica que el bot tenga permisos para enviar mensajes

### ❌ Error al escribir en Google Sheets

- ✅ Verifica que la credencial de Google esté autorizada
- ✅ Verifica que el Document ID sea correcto
- ✅ Verifica que tengas permisos de escritura en la hoja

---

## 📝 Resumen Final

1. ✅ n8n corriendo en Docker
2. ✅ 3 workflows importados
3. ✅ DeepSeek API Key configurada (Workflows 1 y 3)
4. ✅ Telegram configurado (Workflow 1)
5. ✅ Google Sheets configurado (Workflow 2)
6. ✅ URLs de webhooks copiadas
7. ✅ Backend configurado con `localhost` en `.env`
8. ✅ Todos los workflows activos
9. ✅ Probado y funcionando

---

## 🎯 URLs Importantes

- **n8n**: http://localhost:5678
- **API Gateway**: http://localhost:3000
- **DeepSeek Platform**: https://platform.deepseek.com/
- **Google Cloud Console**: https://console.cloud.google.com/
- **Telegram BotFather**: @BotFather en Telegram

---

## 📚 Archivos de Ayuda

- `CONFIGURAR-GOOGLE-SHEETS.md` - Guía detallada de Google Sheets
- `SOLUCION-ERROR-400.md` - Solución de errores de OAuth
- `POR-QUE-NO-EDITAR-URL.md` - Por qué no puedes editar URLs en n8n
- `CONECTAR-WEBHOOK.md` - Cómo conectar webhooks

**¡Sigue estos pasos en orden y todo debería funcionar! 🚀**
