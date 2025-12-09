# Guía de Implementación - Semana 10

## Arquitectura Implementada

### Componentes del Sistema

1. **API Gateway** (Puerto 3000)
   - Punto de entrada REST
   - Enruta peticiones a microservicios vía RabbitMQ
   - No tiene base de datos propia

2. **Microservicio Arquitecto** (Puerto 3001)
   - Entidad Maestra
   - Base de datos PostgreSQL independiente (puerto 5433)
   - Publica eventos de dominio a través de RabbitMQ
   - Escucha eventos de verificación completada

3. **Microservicio Verificación** (Puerto 3002)
   - Entidad Transaccional
   - Base de datos PostgreSQL independiente (puerto 5434)
   - Se comunica con Microservicio A vía RabbitMQ
   - Implementa Consumidor Idempotente con Redis

4. **Infraestructura**
   - RabbitMQ (Puerto 5672, Management 15672)
   - Redis (Puerto 6379)
   - PostgreSQL Arquitecto (Puerto 5433)
   - PostgreSQL Verificación (Puerto 5434)

## Eventos RabbitMQ

### Eventos Publicados por Microservicio A (Arquitecto)
- `arquitecto.creado` - Cuando se crea un nuevo arquitecto
- `arquitecto.actualizado` - Cuando se actualiza un arquitecto
- `arquitecto.verificado` - Cuando un arquitecto es marcado como verificado

### Eventos Publicados por Microservicio B (Verificación)
- `verificacion.solicitada` - Cuando se solicita una nueva verificación
- `verificacion.procesada` - Cuando se actualiza una verificación
- `verificacion.completada` - Cuando una verificación se completa (verificado/rechazado)

### Mensajes Síncronos (Request-Response)
- `arquitecto.exists` - Verifica existencia de arquitecto (desde Microservicio B)
- `arquitecto.create` - Crea arquitecto (desde API Gateway)
- `arquitecto.findOne` - Obtiene arquitecto (desde API Gateway)
- `verificacion.create` - Crea verificación (desde API Gateway)

## Consumidor Idempotente

### Implementación

El Consumidor Idempotente está implementado en el Microservicio de Verificación usando Redis:

1. **Al crear una verificación:**
   - Se verifica si existe una clave de idempotencia en Redis
   - Si existe, se retorna el resultado almacenado (sin procesar)
   - Si no existe, se procesa y se guarda el resultado en Redis con TTL de 24 horas

2. **Clave de Idempotencia:**
   - Formato: `idempotency:{idempotency_key}`
   - Se genera automáticamente si no se proporciona
   - Puede ser proporcionada por el cliente para garantizar idempotencia

3. **Ventajas:**
   - Evita procesamiento duplicado de mensajes
   - Garantiza "exactly-once" semantics
   - Tolerante a fallos de red

## Instalación y Configuración

### 1. Iniciar Infraestructura

```bash
docker-compose up -d
```

Esto iniciará:
- RabbitMQ (admin/admin123 en http://localhost:15672)
- Redis (localhost:6379)
- PostgreSQL Arquitecto (puerto 5433)
- PostgreSQL Verificación (puerto 5434)

### 2. Instalar Dependencias

```bash
# API Gateway
cd api-gateway
npm install

# Microservicio Arquitecto
cd ../microservicio-arquitecto
npm install

# Microservicio Verificación
cd ../microservicio-verificacion
npm install
```

### 3. Ejecutar Migraciones

```bash
# Microservicio Arquitecto
cd microservicio-arquitecto
npm run migration:run

# Microservicio Verificación
cd ../microservicio-verificacion
npm run migration:run
```

### 4. Iniciar Microservicios

En terminales separadas:

```bash
# Terminal 1 - API Gateway
cd api-gateway
npm run start:dev

# Terminal 2 - Microservicio Arquitecto
cd microservicio-arquitecto
npm run start:dev

# Terminal 3 - Microservicio Verificación
cd microservicio-verificacion
npm run start:dev
```

## Pruebas

### Prueba 1: Idempotencia

**Paso 1:** Crear un arquitecto:
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

**Paso 2:** Guardar el ID del arquitecto y crear una verificación con idempotency_key:
```bash
ARQUITECTO_ID="<ID_DEL_ARQUITECTO>"
IDEMPOTENCY_KEY="test-$(date +%s)"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

**Paso 3:** Enviar la misma solicitud 3 veces más:
```bash
for i in {1..3}; do
  curl -X POST http://localhost:3000/verificaciones \
    -H "Content-Type: application/json" \
    -d "{
      \"arquitecto_id\": \"$ARQUITECTO_ID\",
      \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
      \"estado\": \"pendiente\",
      \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
    }"
done
```

**Paso 4:** Verificar en Redis que la clave existe:
```bash
docker exec -it redis-semana10 redis-cli
KEYS idempotency:*
GET idempotency:test-*
```

**Paso 5:** Verificar en la base de datos que solo hay una verificación:
```bash
docker exec -it postgres-verificacion-semana10 psql -U verificacion_user -d verificacion_db
SELECT COUNT(*) FROM verificaciones WHERE arquitecto_id = '<ID_DEL_ARQUITECTO>';
```

### Prueba 2: Comunicación entre Microservicios

**Paso 1:** Crear un arquitecto (Microservicio A):
```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "87654321",
    "descripcion": "Arquitecto para prueba de comunicación",
    "especialidades": "Diseño comercial",
    "ubicacion": "Medellín",
    "usuario_id": "00000000-0000-0000-0000-000000000003"
  }'
```

**Paso 2:** Crear una verificación (Microservicio B se comunica con A vía RabbitMQ):
```bash
ARQUITECTO_ID="<ID_DEL_ARQUITECTO>"
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\"
  }"
```

**Paso 3:** Verificar en RabbitMQ Management (http://localhost:15672) que hay mensajes en las colas:
- `arquitecto.queue` - Mensajes de verificación de existencia
- `verificacion.queue` - Mensajes de creación de verificación

## Endpoints API Gateway

### Arquitectos

- `GET /arquitectos` - Lista todos los arquitectos
- `GET /arquitectos/:id` - Obtiene un arquitecto por ID
- `POST /arquitectos` - Crea un nuevo arquitecto
- `PATCH /arquitectos/:id` - Actualiza un arquitecto

### Verificaciones

- `GET /verificaciones` - Lista todas las verificaciones
- `GET /verificaciones/:id` - Obtiene una verificación por ID
- `POST /verificaciones` - Crea una nueva verificación
- `PATCH /verificaciones/:id` - Actualiza una verificación

## Ejemplos de Uso

### Crear Arquitecto

```bash
curl -X POST http://localhost:3000/arquitectos \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678",
    "descripcion": "Arquitecto especializado en diseño residencial",
    "especialidades": "Diseño residencial, Renovación",
    "ubicacion": "Bogotá, Colombia",
    "usuario_id": "00000000-0000-0000-0000-000000000001"
  }'
```

### Crear Verificación con Idempotencia

```bash
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d '{
    "arquitecto_id": "ARQUITECTO_ID_AQUI",
    "moderador_id": "00000000-0000-0000-0000-000000000002",
    "estado": "pendiente",
    "idempotency_key": "mi-clave-unica-123"
  }'
```

### Actualizar Verificación

```bash
curl -X PATCH http://localhost:3000/verificaciones/VERIFICACION_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "verificado"
  }'
```

## Monitoreo

### RabbitMQ Management

Acceder a http://localhost:15672 con:
- Usuario: `admin`
- Contraseña: `admin123`

Desde aquí puedes:
- Ver colas y mensajes
- Monitorear exchanges
- Ver conexiones y canales

### Redis

```bash
docker exec -it redis-semana10 redis-cli
```

Comandos útiles:
- `KEYS idempotency:*` - Ver todas las claves de idempotencia
- `GET idempotency:CLAVE` - Ver una clave específica
- `TTL idempotency:CLAVE` - Ver tiempo de vida restante

## Consideraciones Importantes

1. **No existe comunicación HTTP directa** entre Microservicio A y B
2. Toda comunicación crítica se realiza vía RabbitMQ
3. El Consumidor Idempotente garantiza procesamiento único mediante claves almacenadas en Redis
4. Los eventos de dominio permiten desacoplamiento entre servicios
5. Cada microservicio tiene su propia base de datos independiente

## Troubleshooting

### Error: "No se puede conectar a RabbitMQ"
- Verificar que RabbitMQ esté corriendo: `docker ps | grep rabbitmq`
- Verificar variables de entorno RABBITMQ_URL

### Error: "No se puede conectar a Redis"
- Verificar que Redis esté corriendo: `docker ps | grep redis`
- Verificar variables de entorno REDIS_HOST y REDIS_PORT

### Error: "No se puede conectar a PostgreSQL"
- Verificar que las bases de datos estén corriendo: `docker ps | grep postgres`
- Verificar variables de entorno DB_HOST, DB_PORT, etc.

### Mensajes duplicados
- Verificar que el Consumidor Idempotente esté funcionando
- Revisar logs del microservicio de Verificación
- Verificar claves en Redis

