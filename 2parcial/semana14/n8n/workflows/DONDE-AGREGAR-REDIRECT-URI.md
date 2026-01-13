# ¿Dónde Agregar la Redirect URI en Google Cloud Console?

## 📍 Ubicación Exacta

En el formulario "Crear ID de cliente de OAuth", la Redirect URI se agrega en la sección:

**"URIs de redireccionamiento autorizados"** (Authorized redirect URIs)

## 🔍 Cómo Encontrarlo

1. **Tipo de aplicación**: "Aplicación web" (dropdown en la parte superior)
2. **Nombre**: Campo de texto (puedes cambiarlo a "n8n Google Sheets")
3. **Orígenes autorizados de JavaScript** (Authorized JavaScript origins) - ⚠️ NO llenes esto
4. **URIs de redireccionamiento autorizados** (Authorized redirect URIs) - ✅ AQUÍ es donde agregas la URI

## ✅ Pasos Detallados

### Paso 1: Encontrar la Sección Correcta

En el formulario, desplázate hacia abajo hasta encontrar:

```
URIs de redireccionamiento autorizados ?
Para usar con solicitudes de un servidor web
[+ Agregar URI]
```

Esta sección está **más abajo** que "Orígenes autorizados de JavaScript".

### Paso 2: Agregar la URI

1. Click en el botón **"+ Agregar URI"** (botón azul con borde blanco y icono +)
2. Aparecerá un campo de texto
3. Ingresa exactamente: `http://localhost:5678/rest/oauth2-credential/callback`
4. Presiona Enter o haz click fuera del campo

### Paso 3: Verificar

Deberías ver la URI listada en la sección "URIs de redireccionamiento autorizados":

```
http://localhost:5678/rest/oauth2-credential/callback
```

## ⚠️ Importante

### ✅ Haz esto:
- Agrega la URI en **"URIs de redireccionamiento autorizados"**
- Usa: `http://localhost:5678/rest/oauth2-credential/callback`
- Usa `localhost`, NO `0.0.0.0`

### ❌ NO hagas esto:
- NO agregues la URI en "Orígenes autorizados de JavaScript"
- NO uses `0.0.0.0` en lugar de `localhost`
- NO uses `https` (usa `http` para desarrollo local)

## 📝 Comparación Visual

```
┌─────────────────────────────────────────────┐
│ Tipo de aplicación: [Aplicación web ▼]     │
│ Nombre: [Cliente web 1]                     │
│                                             │
│ Orígenes autorizados de JavaScript          │
│ Para usar con solicitudes de un navegador   │
│ [+ Agregar URI]  ← NO agregues aquí        │
│                                             │
│ URIs de redireccionamiento autorizados      │
│ Para usar con solicitudes de un servidor    │
│ [+ Agregar URI]  ← ✅ AQUÍ es donde agregas│
└─────────────────────────────────────────────┘
```

## 🎯 Valor a Usar

```
http://localhost:5678/rest/oauth2-credential/callback
```

**Desglose:**
- `http://` - Protocolo (no uses https para desarrollo local)
- `localhost` - Host (NO uses 0.0.0.0)
- `5678` - Puerto de n8n
- `/rest/oauth2-credential/callback` - Ruta de callback de n8n

## ✅ Después de Agregar

1. Verifica que la URI esté en la lista
2. Click en **"Crear"** o **"Create"** (botón al final)
3. Se mostrará un diálogo con Client ID y Client Secret
4. Copia ambos valores inmediatamente

## 🔧 Si Ya Creaste las Credenciales

Si ya creaste las credenciales sin la URI o con la URI incorrecta:

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Click en el nombre de tu OAuth 2.0 Client ID
3. En "URIs de redireccionamiento autorizados", agrega o edita la URI
4. Click en **"Guardar"**

¡Listo! La URI debe estar en "URIs de redireccionamiento autorizados", no en "Orígenes autorizados de JavaScript". 🚀
