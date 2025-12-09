@echo off
REM Script de demostración completa para la presentación en Windows
REM Ejecuta todos los pasos de la demo en orden

echo 🎯 DEMOSTRACIÓN COMPLETA - SEMANA 10/11
echo ========================================
echo.

REM Verificar que los servicios estén corriendo
echo 1. Verificando servicios...
curl -s http://localhost:3000/arquitectos >nul 2>&1
if errorlevel 1 (
    echo ❌ API Gateway no está respondiendo en puerto 3000
    pause
    exit /b 1
)
echo ✅ API Gateway funcionando
echo.

REM Paso 1: Crear Arquitecto
echo 2. Creando Arquitecto...
curl -s -X POST http://localhost:3000/arquitectos -H "Content-Type: application/json" -d "{\"cedula\":\"12345678\",\"descripcion\":\"Arquitecto de prueba para demo\",\"especialidades\":\"Diseño residencial y comercial\",\"ubicacion\":\"Bogotá\",\"usuario_id\":\"00000000-0000-0000-0000-000000000001\"}" > temp_arquitecto.json
echo ✅ Arquitecto creado
type temp_arquitecto.json
echo.

REM Paso 2: Verificar Arquitecto
echo 3. Verificando que el arquitecto existe...
curl -s http://localhost:3000/arquitectos
echo.
echo.

REM Paso 3: Crear Verificación
echo 4. Creando Verificación (primera vez)...
set IDEMPOTENCY_KEY=demo-%RANDOM%
curl -s -X POST http://localhost:3000/verificaciones -H "Content-Type: application/json" -d "{\"arquitecto_id\":\"TEMP_ID\",\"moderador_id\":\"00000000-0000-0000-0000-000000000002\",\"estado\":\"pendiente\",\"idempotency_key\":\"%IDEMPOTENCY_KEY%\"}" > temp_verificacion.json
echo ✅ Verificación creada
type temp_verificacion.json
echo.

REM Paso 4: Demo de Idempotencia
echo 5. DEMO DE IDEMPOTENCIA: Enviando la misma solicitud 3 veces...
echo.
for /L %%i in (1,1,3) do (
    echo Intento %%i:
    curl -s -X POST http://localhost:3000/verificaciones -H "Content-Type: application/json" -d "{\"arquitecto_id\":\"TEMP_ID\",\"moderador_id\":\"00000000-0000-0000-0000-000000000002\",\"estado\":\"pendiente\",\"idempotency_key\":\"%IDEMPOTENCY_KEY%\"}"
    echo.
    timeout /t 1 /nobreak >nul
)

REM Limpiar archivos temporales
del temp_arquitecto.json temp_verificacion.json 2>nul

echo.
echo ========================================
echo 🎉 DEMOSTRACIÓN COMPLETA
echo ========================================
echo.
echo Nota: Para verificar Redis y PostgreSQL, usa los comandos manuales
echo.
pause

