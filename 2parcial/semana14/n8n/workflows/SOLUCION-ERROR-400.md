# Solución: Error 400 de Google OAuth

## 🔴 Problema: Error 400 Bad Request

Si ves el error **"400. That's an error. The server cannot process the request because it is malformed"**, el problema más común es que el **Redirect URI** no coincide entre n8n y Google Cloud Console.

## ✅ Solución Paso a Paso

### 1. Verificar el Redirect URI en n8n

En la configuración de Google Sheets en n8n, el **OAuth Redirect URL** debe ser:
```
http://localhost:5678/rest/oauth2-credential/callback
```

**❌ NO uses**: `http://0.0.0.0:5678/rest/oauth2-credential/callback`
**✅ USA**: `http://localhost:5678/rest/oauth2-credential/callback`

### 2. Actualizar en Google Cloud Console

1. **Ve a Google Cloud Console**:
   - https://console.cloud.google.com/apis/credentials

2. **Edita tu OAuth 2.0 Client ID**:
   - Click en el nombre de tu credencial OAuth 2.0
   - En la sección **"URI de redirección autorizados"**
   - Verifica que tengas exactamente: `http://localhost:5678/rest/oauth2-credential/callback`
   - Si tienes `0.0.0.0`, elimínalo y agrega `localhost`
   - Click en **"Guardar"**

### 3. Actualizar en n8n

1. **En n8n, en la configuración de Google Sheets**:
   - Verifica que el **OAuth Redirect URL** sea: `http://localhost:5678/rest/oauth2-credential/callback`
   - Si dice `0.0.0.0`, cámbialo a `localhost`
   - Click en **"Save"**

### 4. Autorizar la Conexión

**SÍ, es necesario hacer clic en "Sign in with Google"**:

1. Después de guardar la configuración en n8n
2. Click en el botón **"Sign in with Google"** (botón azul con logo de Google)
3. Se abrirá una ventana de Google
4. Selecciona tu cuenta de Google
5. Click en **"Permitir"** o **"Allow"**
6. La ventana se cerrará y n8n mostrará que la conexión fue exitosa

## 🔍 Verificación

### Verificar que los URIs Coinciden

**En Google Cloud Console debe estar**:
```
http://localhost:5678/rest/oauth2-credential/callback
```

**En n8n debe estar**:
```
http://localhost:5678/rest/oauth2-credential/callback
```

**Deben ser EXACTAMENTE iguales** (incluyendo http vs https, localhost vs 0.0.0.0, etc.)

## 🛠️ Si el Error Persiste

### 1. Limpiar Caché del Navegador
- Cierra todas las ventanas de Google
- Limpia la caché del navegador
- Intenta de nuevo

### 2. Verificar que las APIs Estén Habilitadas
- Ve a: https://console.cloud.google.com/apis/library
- Verifica que **Google Sheets API** esté habilitada
- Verifica que **Google Drive API** esté habilitada

### 3. Verificar Usuarios de Prueba
- Si tu app está en modo "Prueba", ve a la pantalla de consentimiento
- Asegúrate de que tu email esté en la lista de "Test users"
- Si no está, agrégalo

### 4. Crear Nuevas Credenciales
Si nada funciona:
1. Ve a Credenciales en Google Cloud Console
2. Elimina el OAuth 2.0 Client ID actual
3. Crea uno nuevo siguiendo los pasos de `CONFIGURAR-GOOGLE-SHEETS.md`
4. Asegúrate de usar `localhost` desde el principio

## 📝 Resumen

1. ✅ **SÍ necesitas hacer clic en "Sign in with Google"** para autorizar
2. ✅ **Cambia `0.0.0.0` por `localhost`** en ambos lugares (n8n y Google Cloud)
3. ✅ **Los URIs deben ser exactamente iguales**
4. ✅ **Guarda los cambios** en ambos lugares
5. ✅ **Intenta autorizar de nuevo**

## 🎯 Checklist Rápido

- [ ] Redirect URI en Google Cloud: `http://localhost:5678/rest/oauth2-credential/callback`
- [ ] Redirect URI en n8n: `http://localhost:5678/rest/oauth2-credential/callback`
- [ ] Ambos son exactamente iguales
- [ ] Google Sheets API habilitada
- [ ] Google Drive API habilitada
- [ ] Tu email está en Test users (si está en modo prueba)
- [ ] Click en "Sign in with Google" en n8n
- [ ] Autorizaste en la ventana de Google

¡Con estos pasos debería funcionar! 🚀
