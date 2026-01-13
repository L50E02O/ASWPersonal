# Configurar Google Sheets OAuth2 en n8n

## 📋 Pasos para Obtener Client ID y Client Secret

### 1. Crear un Proyecto en Google Cloud Console

1. **Ve a Google Cloud Console**:
   - Visita: https://console.cloud.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crear un Nuevo Proyecto**:
   - Click en el selector de proyectos (arriba, junto al logo de Google Cloud)
   - Click en **"Nuevo Proyecto"** o **"New Project"**
   - Ingresa un nombre (ej: "n8n-integration" o "mi-proyecto-n8n")
   - Click en **"Crear"** o **"Create"**
   - Espera a que se cree el proyecto (puede tomar unos segundos)

### 2. Habilitar las APIs Necesarias

1. **Ir a la Biblioteca de APIs**:
   - En el menú lateral izquierdo, busca **"APIs y servicios"** → **"Biblioteca"**
   - O ve directamente a: https://console.cloud.google.com/apis/library

2. **Habilitar Google Sheets API**:
   - Busca **"Google Sheets API"**
   - Click en el resultado
   - Click en el botón **"Habilitar"** o **"Enable"**
   - Espera a que se habilite

3. **Habilitar Google Drive API**:
   - Busca **"Google Drive API"**
   - Click en el resultado
   - Click en el botón **"Habilitar"** o **"Enable"**
   - Espera a que se habilite

**⚠️ IMPORTANTE**: Ambas APIs deben estar habilitadas para que funcione correctamente.

### 3. Crear Credenciales OAuth2

1. **Ir a Credenciales**:
   - En el menú lateral, ve a **"APIs y servicios"** → **"Credenciales"**
   - O ve directamente a: https://console.cloud.google.com/apis/credentials

2. **Crear Credenciales OAuth2**:
   - Click en **"+ CREAR CREDENCIALES"** o **"+ CREATE CREDENTIALS"**
   - Selecciona **"ID de cliente de OAuth"** o **"OAuth client ID"**

3. **Configurar Pantalla de Consentimiento** (si es la primera vez):
   - Si es la primera vez, te pedirá configurar la pantalla de consentimiento
   - En el paso **"Público"** o **"Public"**:
     - ✅ **Selecciona "Usuarios externos"** o **"External users"** (para proyectos personales/académicos)
     - ❌ **NO selecciones "Interno"** (solo para organizaciones de Google Workspace)
   - Click en **"Siguiente"** o **"Next"**
   - Completa el formulario:
     - **Nombre de la aplicación**: "n8n Integration" (o el que prefieras)
     - **Correo electrónico de soporte**: Tu email
     - **Dominio autorizado**: Puedes dejarlo vacío para desarrollo
     - **Correo electrónico del desarrollador**: Tu email
   - Click en **"Guardar y continuar"** o **"Save and Continue"**
   - En "Scopes" (Alcances), click en **"Guardar y continuar"**
   - En "Test users" (Usuarios de prueba), agrega tu email de Google
   - Click en **"Guardar y continuar"**
   - Click en **"Volver al panel"** o **"Back to Dashboard"**

4. **Crear el ID de Cliente OAuth2**:
   - Ahora sí, click en **"+ CREAR CREDENCIALES"** → **"ID de cliente de OAuth"**
   - **Tipo de aplicación**: Selecciona **"Aplicación web"** o **"Web application"** (dropdown)
   - **Nombre**: Puedes cambiar "Cliente web 1" a "n8n Google Sheets" (opcional, solo para identificación)
   - **URIs de redireccionamiento autorizados** (Authorized redirect URIs):
     - **Busca la sección** "URIs de redireccionamiento autorizados" (está más abajo en el formulario)
     - Click en el botón **"+ Agregar URI"** o **"+ Add URI"** (botón azul con borde blanco y icono +)
     - Aparecerá un campo de texto
     - Ingresa: `http://localhost:5678/rest/oauth2-credential/callback`
     - **⚠️ IMPORTANTE**: 
       - Usa `localhost`, NO uses `0.0.0.0`
       - Debe ser exactamente: `http://localhost:5678/rest/oauth2-credential/callback`
     - **NO necesitas llenar** "Orígenes autorizados de JavaScript" (puedes dejarlo vacío)
   - Click en **"Crear"** o **"Create"** (botón al final del formulario)

5. **Copiar las Credenciales**:
   - Se mostrará un diálogo con:
     - **ID de cliente** (Client ID) - Copia este valor
     - **Secreto de cliente** (Client Secret) - Copia este valor
   - **⚠️ IMPORTANTE**: Copia ambos valores inmediatamente, el Client Secret solo se muestra una vez
   - Click en **"Aceptar"** o **"OK"**

### 4. Configurar en n8n

1. **En n8n, en el nodo Google Sheets**:
   - Pega el **Client ID** en el campo "Client ID"
   - Pega el **Client Secret** en el campo "Client Secret"
   - El **OAuth Redirect URL** ya debería estar prellenado: `http://localhost:5678/rest/oauth2-credential/callback`

2. **Click en "Save"** (botón rojo arriba a la derecha)

3. **Autorizar**:
   - Después de guardar, n8n te pedirá autorizar la conexión
   - Click en el botón de autorización
   - Se abrirá una ventana de Google para autorizar
   - Selecciona tu cuenta de Google
   - Click en **"Permitir"** o **"Allow"**
   - Se cerrará la ventana y n8n mostrará que la conexión fue exitosa

## ✅ Verificar que Funciona

1. **Probar el Workflow**:
   - Activa el workflow de sincronización
   - Envía un webhook de prueba
   - Verifica que los datos se agreguen a tu Google Sheet

2. **Verificar en Google Sheets**:
   - Abre tu Google Sheet
   - Deberías ver una nueva fila con los datos del evento

## 🔧 Solución de Problemas

### Error: "This field is required"
- Asegúrate de haber copiado correctamente el Client ID y Client Secret
- No dejes espacios al inicio o final

### Error: "Redirect URI mismatch" o "Error 400"
- **Problema más común**: El Redirect URI usa `0.0.0.0` en lugar de `localhost`
- **Solución**: 
  - En Google Cloud Console: Cambia a `http://localhost:5678/rest/oauth2-credential/callback`
  - En n8n: Verifica que también use `localhost` (no `0.0.0.0`)
  - Los URIs deben ser EXACTAMENTE iguales en ambos lugares
- Ver guía completa en `SOLUCION-ERROR-400.md`

### Error: "Access blocked"
- Verifica que hayas agregado tu email como "Test user" en la pantalla de consentimiento
- Si estás en modo de prueba, solo los usuarios agregados pueden usar la app

### Las APIs no están habilitadas
- Ve a la Biblioteca de APIs y verifica que tanto "Google Sheets API" como "Google Drive API" estén habilitadas
- Si no están, habilítalas y espera unos minutos

### No puedo ver el Client Secret
- El Client Secret solo se muestra una vez al crear las credenciales
- Si lo perdiste, necesitas crear nuevas credenciales:
  - Ve a Credenciales en Google Cloud Console
  - Click en tu OAuth 2.0 Client ID
  - Click en "Eliminar" y crea uno nuevo

## 📝 Resumen Rápido

1. ✅ Ve a https://console.cloud.google.com/
2. ✅ Crea un proyecto nuevo
3. ✅ Habilita "Google Sheets API" y "Google Drive API"
4. ✅ Ve a Credenciales → Crear → OAuth client ID
5. ✅ Tipo: Aplicación web
6. ✅ Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
7. ✅ Copia Client ID y Client Secret
8. ✅ Pega en n8n y autoriza

## 🎯 URLs Importantes

- **Google Cloud Console**: https://console.cloud.google.com/
- **Biblioteca de APIs**: https://console.cloud.google.com/apis/library
- **Credenciales**: https://console.cloud.google.com/apis/credentials

¡Listo! Con estos pasos deberías poder configurar Google Sheets en n8n. 🚀
