# Guía de Redis - Consumidor Idempotente

## 🎯 ¿Qué es Redis y para qué se usa aquí?

Redis es una base de datos en memoria (in-memory) que se usa en este proyecto para implementar el **Consumidor Idempotente**. Su función es evitar que se procesen operaciones duplicadas.

### ¿Por qué Redis?

- ⚡ **Muy rápido**: Operaciones O(1) - acceso instantáneo
- 🔑 **Clave-Valor**: Perfecto para almacenar claves de idempotencia
- ⏰ **TTL (Time To Live)**: Las claves expiran automáticamente después de 24 horas
- 💾 **Persistencia opcional**: Puede guardar datos en disco si se necesita

---

## 🔧 Cómo Funciona en Este Proyecto

### Flujo de Idempotencia

```
1. Cliente envía solicitud con idempotency_key
   ↓
2. Sistema verifica en Redis: ¿Existe esta clave?
   ↓
3a. Si SÍ existe → Retorna resultado cacheado (NO toca BD)
3b. Si NO existe → Procesa la solicitud
   ↓
4. Guarda resultado en Redis con TTL de 24 horas
   ↓
5. Retorna resultado al cliente
```

### Estructura de Datos en Redis

**Formato de clave:**
```
idempotency:{idempotency_key}
```

**Ejemplos:**
- `idempotency:test-1234567890`
- `idempotency:auto-verificacion-a1b2c3d4-e5f6-7890`
- `idempotency:update:test-9876543210`

**Valor almacenado:**
```json
{
  "id": "verificacion-id",
  "arquitecto_id": "arquitecto-id",
  "estado": "pendiente",
  "created_at": "2025-12-09T19:00:00.000Z"
}
```

---

## 🐳 Cómo Acceder a Redis con Docker

### Método 1: Usando `docker exec` (Recomendado)

```bash
# Acceder al contenedor de Redis
docker exec -it redis-semana10 redis-cli
```

**Una vez dentro, puedes ejecutar comandos:**

```redis
# Ver todas las claves de idempotencia
KEYS idempotency:*

# Ver una clave específica
GET idempotency:test-1234567890

# Ver todas las claves (cuidado si hay muchas)
KEYS *

# Ver cuántas claves hay
DBSIZE

# Ver el TTL (tiempo de vida restante) de una clave
TTL idempotency:test-1234567890

# Eliminar una clave específica
DEL idempotency:test-1234567890

# Eliminar todas las claves (limpiar para pruebas)
FLUSHDB

# Salir de redis-cli
exit
```

### Método 2: Ejecutar comandos directamente (sin entrar al CLI)

```bash
# Ver todas las claves de idempotencia
docker exec -it redis-semana10 redis-cli KEYS idempotency:*

# Obtener el valor de una clave específica
docker exec -it redis-semana10 redis-cli GET idempotency:test-1234567890

# Ver cuántas claves hay en total
docker exec -it redis-semana10 redis-cli DBSIZE

# Eliminar una clave
docker exec -it redis-semana10 redis-cli DEL idempotency:test-1234567890

# Limpiar toda la base de datos (para pruebas)
docker exec -it redis-semana10 redis-cli FLUSHDB

# Verificar que Redis está funcionando
docker exec -it redis-semana10 redis-cli PING
# Debe responder: PONG
```

---

## 📊 Comandos Útiles para la Demo

### Ver todas las claves de idempotencia

```bash
docker exec -it redis-semana10 redis-cli KEYS idempotency:*
```

**Salida esperada:**
```
1) "idempotency:test-1234567890"
2) "idempotency:auto-verificacion-a1b2c3d4"
3) "idempotency:update:test-9876543210"
```

### Ver el contenido de una clave específica

```bash
docker exec -it redis-semana10 redis-cli GET idempotency:test-1234567890
```

**Salida esperada:**
```json
{"id":"verificacion-id","arquitecto_id":"arquitecto-id","estado":"pendiente","created_at":"2025-12-09T19:00:00.000Z"}
```

### Ver el TTL (tiempo de vida restante)

```bash
docker exec -it redis-semana10 redis-cli TTL idempotency:test-1234567890
```

**Salida esperada:**
- `86399` = 86399 segundos restantes (casi 24 horas)
- `-1` = La clave no tiene TTL (no debería pasar en este proyecto)
- `-2` = La clave no existe

### Ver todas las claves con sus valores (formato legible)

```bash
# Entrar al CLI
docker exec -it redis-semana10 redis-cli

# Dentro de Redis:
KEYS idempotency:*

# Para cada clave, obtener su valor:
GET idempotency:test-1234567890
GET idempotency:auto-verificacion-a1b2c3d4
```

### Limpiar datos de prueba

```bash
# Eliminar todas las claves de idempotencia
docker exec -it redis-semana10 redis-cli FLUSHDB

# O eliminar solo las de prueba
docker exec -it redis-semana10 redis-cli KEYS idempotency:test-* | xargs docker exec -it redis-semana10 redis-cli DEL
```

---

## 🔍 Ejemplo Práctico Completo

### Paso 1: Crear una verificación

```bash
IDEMPOTENCY_KEY="demo-$(date +%s)"

curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

### Paso 2: Verificar que se guardó en Redis

```bash
# Ver la clave
docker exec -it redis-semana10 redis-cli GET idempotency:$IDEMPOTENCY_KEY
```

**Salida:**
```json
{"id":"abc-123","arquitecto_id":"xyz-789","estado":"pendiente","created_at":"2025-12-09T19:00:00.000Z"}
```

### Paso 3: Ver el TTL

```bash
docker exec -it redis-semana10 redis-cli TTL idempotency:$IDEMPOTENCY_KEY
```

**Salida:**
```
86399
```
(Esto significa que la clave expirará en ~24 horas)

### Paso 4: Enviar la misma solicitud (debe usar el cache)

```bash
curl -X POST http://localhost:3000/verificaciones \
  -H "Content-Type: application/json" \
  -d "{
    \"arquitecto_id\": \"$ARQUITECTO_ID\",
    \"moderador_id\": \"00000000-0000-0000-0000-000000000002\",
    \"estado\": \"pendiente\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\"
  }"
```

**Observa los logs del microservicio:**
```
[Solicitud duplicada detectada: demo-1234567890]
```

Esto significa que Redis encontró la clave y retornó el resultado cacheado.

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to Redis"

```bash
# Verificar que el contenedor está corriendo
docker ps | grep redis

# Si no está corriendo:
docker-compose up -d redis

# Verificar que Redis responde
docker exec -it redis-semana10 redis-cli PING
```

### Error: "Connection refused"

```bash
# Verificar los logs del contenedor
docker logs redis-semana10

# Reiniciar el contenedor
docker restart redis-semana10
```

### No veo las claves que esperaba

```bash
# Verificar que estás usando la base de datos correcta (Redis tiene múltiples DBs)
docker exec -it redis-semana10 redis-cli SELECT 0

# Ver todas las claves
docker exec -it redis-semana10 redis-cli KEYS *
```

---

## 📝 Comandos Rápidos de Referencia

```bash
# Acceder a Redis CLI
docker exec -it redis-semana10 redis-cli

# Ver todas las claves de idempotencia
docker exec -it redis-semana10 redis-cli KEYS idempotency:*

# Obtener valor de una clave
docker exec -it redis-semana10 redis-cli GET idempotency:{key}

# Ver TTL de una clave
docker exec -it redis-semana10 redis-cli TTL idempotency:{key}

# Eliminar una clave
docker exec -it redis-semana10 redis-cli DEL idempotency:{key}

# Limpiar toda la base de datos
docker exec -it redis-semana10 redis-cli FLUSHDB

# Verificar que Redis funciona
docker exec -it redis-semana10 redis-cli PING

# Ver cuántas claves hay
docker exec -it redis-semana10 redis-cli DBSIZE
```

---

## 🎯 Para la Presentación

### Qué mostrar:

1. **Antes de crear una verificación:**
   ```bash
   docker exec -it redis-semana10 redis-cli KEYS idempotency:*
   # Debe estar vacío o mostrar claves anteriores
   ```

2. **Después de crear una verificación:**
   ```bash
   docker exec -it redis-semana10 redis-cli KEYS idempotency:*
   # Debe mostrar la nueva clave
   
   docker exec -it redis-semana10 redis-cli GET idempotency:{key}
   # Debe mostrar el JSON con los datos de la verificación
   ```

3. **Después de enviar solicitudes duplicadas:**
   ```bash
   docker exec -it redis-semana10 redis-cli GET idempotency:{key}
   # La misma clave sigue ahí, y el sistema la usa para evitar duplicados
   ```

### Explicación:

> "Redis almacena el resultado de cada operación procesada con una clave única (idempotency_key). Cuando llega una solicitud duplicada, Redis verifica si la clave existe en O(1) - tiempo constante, muy rápido. Si existe, retorna el resultado cacheado sin tocar la base de datos. Esto garantiza que el efecto en la base de datos ocurra exactamente una vez, incluso si RabbitMQ reenvía el mensaje múltiples veces."

---

## 🔗 Referencias

- [Redis Commands](https://redis.io/commands/)
- [Redis Data Types](https://redis.io/docs/data-types/)
- [Redis TTL](https://redis.io/commands/ttl/)

