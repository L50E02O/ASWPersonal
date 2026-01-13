# ¿Interno o Usuarios Externos en Google Cloud Console?

## 🎯 Respuesta Rápida

**Para proyectos personales/académicos (como este):**
- ✅ **Selecciona "Usuarios externos"** (External users)
- ❌ **NO selecciones "Interno"** (Internal)

## 📋 Explicación Detallada

### "Usuarios externos" (External users) - ✅ RECOMENDADO

**Cuándo usar:**
- ✅ Proyectos personales
- ✅ Proyectos académicos
- ✅ Aplicaciones que usas tú mismo
- ✅ Desarrollo y pruebas
- ✅ No tienes Google Workspace (organización empresarial)

**Características:**
- Tu app inicia en **modo de prueba**
- Solo disponible para usuarios que agregues a la lista de "Test users"
- Puedes agregar tu propio email como usuario de prueba
- Perfecto para desarrollo y uso personal
- Cuando esté lista para producción, podrías necesitar verificación

**Ventajas:**
- ✅ Fácil de configurar
- ✅ No requiere organización empresarial
- ✅ Perfecto para proyectos personales
- ✅ Puedes agregar hasta 100 usuarios de prueba

### "Interno" (Internal) - ❌ NO USAR

**Cuándo usar:**
- Solo si tienes **Google Workspace** (organización empresarial)
- Solo para usuarios dentro de tu organización
- Para empresas o instituciones educativas con Workspace

**Características:**
- Solo disponible para usuarios de tu organización
- Requiere cuenta de Google Workspace
- No necesitas enviar la app para verificación
- Limitado a usuarios de la organización

**Desventajas:**
- ❌ Requiere Google Workspace (no es gratis)
- ❌ No funciona con cuentas personales de Google
- ❌ No es para proyectos personales/académicos simples

## 🎯 Para tu Proyecto (n8n + Google Sheets)

**Selecciona: "Usuarios externos"** porque:

1. ✅ Es un proyecto personal/académico
2. ✅ No tienes Google Workspace
3. ✅ Usas tu cuenta personal de Google
4. ✅ Solo necesitas acceso para ti mismo (puedes agregarte como test user)
5. ✅ Es más simple y adecuado para desarrollo

## 📝 Pasos Completos

1. En la pantalla "Público" (Public):
   - ✅ Selecciona **"Usuarios externos"** (External users)
   - Click en **"Siguiente"** (Next)

2. En "Información de contacto" (Contact information):
   - Completa tu email y otra información requerida
   - Click en **"Siguiente"**

3. En "Usuarios de prueba" (Test users):
   - **Agrega tu email de Google** como usuario de prueba
   - Esto permitirá que autorices la app con tu cuenta
   - Click en **"Guardar y continuar"**

4. Completa la configuración y crea las credenciales OAuth2

## ⚠️ Nota Importante

Si ya seleccionaste "Interno" por error:
- Puedes editar la configuración desde la pantalla de consentimiento
- O simplemente crear un nuevo proyecto y empezar de nuevo
- No hay problema en crear múltiples proyectos para pruebas

## ✅ Resumen

- **Proyecto personal/académico** → "Usuarios externos" ✅
- **Organización con Workspace** → "Interno"
- **Tu caso** → "Usuarios externos" ✅

¡Selecciona "Usuarios externos" y continúa! 🚀
