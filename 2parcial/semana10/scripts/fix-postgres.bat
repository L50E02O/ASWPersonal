@echo off
REM Script para corregir los problemas de conexión de PostgreSQL en Windows
REM Reinicia los contenedores de PostgreSQL con la configuración correcta

echo Reiniciando contenedores de PostgreSQL...

REM Detener los contenedores
docker-compose stop postgres-arquitecto postgres-verificacion

REM Eliminar los contenedores (esto NO elimina los volúmenes de datos)
docker-compose rm -f postgres-arquitecto postgres-verificacion

REM Iniciar los contenedores nuevamente
docker-compose up -d postgres-arquitecto postgres-verificacion

echo Esperando a que PostgreSQL este listo...
timeout /t 5 /nobreak >nul

REM Verificar que los contenedores esten corriendo
echo Estado de los contenedores:
docker-compose ps postgres-arquitecto postgres-verificacion

echo.
echo Si los contenedores estan corriendo, ejecuta las migraciones:
echo    cd microservicio-arquitecto ^&^& npm run migration:run
echo    cd microservicio-verificacion ^&^& npm run migration:run

pause

