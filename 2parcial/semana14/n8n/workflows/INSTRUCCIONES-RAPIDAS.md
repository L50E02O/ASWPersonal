# Instrucciones Rápidas para Importar Workflows en n8n

> **⚠️ Si estás estancado, lee primero**: `GUIA-COMPLETA-PASO-A-PASO.md` - Guía completa desde cero

## 📋 Pasos Rápidos

### 1. Importar Workflows
1. Abre n8n: `http://localhost:5678`
2. Click en **"Workflows"** → **"Import from File"**
3. Importa cada archivo JSON:
   - `1-notificacion-telegram.json`
   - `2-sincronizacion-google-sheets.json`
   - `3-alertas-gemini-switch.json`

### 2. Configurar Valores en los Workflows (GRATIS - Sin Enterprise)

**IMPORTANTE**: No necesitas el plan Enterprise. Los valores se configuran directamente en cada workflow.

Después de importar cada workflow:

1. **Workflow 1 (Notificación Telegram)**:
   - Abre el workflow
   - Click en el nodo **"Set - Configuración"**
   - Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key de DeepSeek
   - Reemplaza `TU_CHAT_ID_DE_TELEGRAM_AQUI` con tu Chat ID de Telegram

2. **Workflow 2 (Sincronización Google Sheets)**:
   - Abre el workflow
   - Click en el nodo **"Set - Configuración"**
   - Reemplaza `TU_GOOGLE_SHEETS_DOCUMENT_ID_AQUI` con el ID de tu Google Sheet
   - (El ID está en la URL de tu Google Sheet: `https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit`)

3. **Workflow 3 (Alertas)**:
   - Abre el workflow
   - Click en el nodo **"Set - Configuración"**
   - Reemplaza `TU_API_KEY_DE_DEEPSEEK_AQUI` con tu API key de DeepSeek

### 3. Configurar Credenciales en cada Workflow

#### Workflow 1 (Telegram):
- Click en nodo "Telegram - Enviar Mensaje"
- Crear credencial Telegram con tu Bot Token

#### Workflow 2 (Google Sheets):
- Click en nodo "Google Sheets - Append"
- Crear credencial Google Sheets OAuth2
- **📖 Guía completa**: Ver `CONFIGURAR-GOOGLE-SHEETS.md` para obtener Client ID y Client Secret
- **Resumen rápido**:
  1. Ve a https://console.cloud.google.com/
  2. Crea proyecto → Habilita "Google Sheets API" y "Google Drive API"
  3. Credenciales → Crear → OAuth client ID (Tipo: Aplicación web)
  4. Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
  5. Copia Client ID y Client Secret → Pega en n8n

#### Workflow 3 (Alertas):
- Usa la misma GEMINI_API_KEY del Workflow 1

### 4. Obtener URLs de Webhooks
1. Abre cada workflow
2. Click en el nodo **Webhook**
3. Click en **"Listen for Test Event"**
4. Copia la URL (ej: `http://localhost:5678/webhook-test/abc123`)

### 5. Activar Workflows
- Activa el toggle (esquina superior derecha) en cada workflow

### 6. Configurar Backend
Actualiza `.env` del api-gateway:
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/TU-WEBHOOK-ID-AQUI
```

## ⚠️ Nota Importante

Los workflows están diseñados para recibir eventos con este formato:
```json
{
  "evento": "arquitecto.creado",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": { ... }
}
```

Si necesitas ajustar las expresiones en los nodos después de importar, puedes hacerlo desde la interfaz de n8n.
