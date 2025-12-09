# Inicio Rápido - Semana 10

## Prerrequisitos

- Node.js 18+ instalado
- Docker y Docker Compose instalados
- Git (opcional)

## Pasos para Iniciar

### 1. Iniciar Infraestructura

```bash
cd semana10
docker-compose up -d
```

Esto iniciará:
- ✅ RabbitMQ (http://localhost:15672 - admin/admin123)
- ✅ Redis (localhost:6379)
- ✅ PostgreSQL Arquitecto (puerto 5433)
- ✅ PostgreSQL Verificación (puerto 5434)

**Verificar que todos los servicios estén corriendo:**
```bash
docker ps
```

### 2. Instalar Dependencias

Abre 3 terminales y ejecuta en cada una:

**Terminal 1 - API Gateway:**
```bash
cd semana10/api-gateway
npm install
```

**Terminal 2 - Microservicio Arquitecto:**
```bash
cd semana10/microservicio-arquitecto
npm install
```

**Terminal 3 - Microservicio Verificación:**
```bash
cd semana10/microservicio-verificacion
npm install
```

### 3. Configurar Variables de Entorno

Copia los archivos de ejemplo (opcional, los valores por defecto funcionan):

```bash
# API Gateway
cp semana10/api-gateway/env.example semana10/api-gateway/.env

# Microservicio Arquitecto
cp semana10/microservicio-arquitecto/env.example semana10/microservicio-arquitecto/.env

# Microservicio Verificación
cp semana10/microservicio-verificacion/env.example semana10/microservicio-verificacion/.env
```

### 4. Ejecutar Migraciones

**Microservicio Arquitecto:**
```bash
cd semana10/microservicio-arquitecto
npm run migration:run
```

**Microservicio Verificación:**
```bash
cd semana10/microservicio-verificacion
npm run migration:run
```

### 5. Iniciar Microservicios

En 3 terminales separadas:

**Terminal 1 - API Gateway:**
```bash
cd semana10/api-gateway
npm run start:dev
```
Deberías ver: `API Gateway ejecutándose en puerto 3000`

**Terminal 2 - Microservicio Arquitecto:**
```bash
cd semana10/microservicio-arquitecto
npm run start:dev
```
Deberías ver: `Microservicio Arquitecto ejecutándose en puerto 3001`

**Terminal 3 - Microservicio Verificación:**
```bash
cd semana10/microservicio-verificacion
npm run start:dev
```
Deberías ver: `Microservicio Verificación ejecutándose en puerto 3002`

### 6. Probar el Sistema

**Crear un Arquitecto:**
```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678",
    "descripcion": "Arquitecto de prueba",
    "especialidades": "Diseño residencial",
    "ubicacion": "Bogotá",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }'
```

**Crear una Verificación:**
```bash
# Primero obtén el ID del arquitecto creado
ARQUITECTO_ID="<ID_DEL_ARQUITECTO>"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\"
  }"
```

## Verificación de Funcionamiento

### 1. Verificar RabbitMQ

Abre http://localhost:15672 en tu navegador:
- Usuario: `admin`
- Contraseña: `admin123`

Deberías ver las colas:
- `arquitecto.queue`
- `verificacion.queue`

### 2. Verificar Redis

```bash
docker exec -it redis-semana10 redis-cli
KEYS idempotency:*
```

### 3. Verificar Requisitos

```bash
# Verificar que el proyecto cumple con todos los requisitos
cd semana10
node scripts/verificar-requisitos.js
```

## Solución de Problemas

### Error: "Cannot connect to RabbitMQ"
```bash
# Verificar que RabbitMQ esté corriendo
docker ps | grep rabbitmq

# Si no está corriendo:
docker-compose up -d rabbitmq
```

### Error: "Cannot connect to Redis"
```bash
# Verificar que Redis esté corriendo
docker ps | grep redis

# Si no está corriendo:
docker-compose up -d redis
```

### Error: "Cannot connect to PostgreSQL"
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Si no está corriendo:
docker-compose up -d postgres-arquitecto postgres-verificacion
```

### Error: "Migration failed"
```bash
# Asegúrate de que las bases de datos estén corriendo antes de ejecutar migraciones
docker-compose up -d postgres-arquitecto postgres-verificacion

# Espera unos segundos y vuelve a intentar
npm run migration:run
```

## Siguientes Pasos

1. Lee la [GUIA_IMPLEMENTACION.md](./GUIA_IMPLEMENTACION.md) para entender la arquitectura completa
2. Revisa [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) para entender la organización del código
3. Ejecuta los scripts de prueba para validar la idempotencia y comunicación entre servicios

## Detener los Servicios

```bash
# Detener microservicios (Ctrl+C en cada terminal)

# Detener infraestructura
cd semana10
docker-compose down

# Si quieres eliminar los datos también:
docker-compose down -v
```

