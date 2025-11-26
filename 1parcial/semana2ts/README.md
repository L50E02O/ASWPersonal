# Aplicación de Conferencias con TypeORM

Este proyecto es una aplicación de gestión de conferencias que implementa el patrón CPM (Create, Process, Modify) utilizando TypeORM como ORM (Object-Relational Mapping) para interactuar con la base de datos.

## Descripción

La aplicación permite gestionar usuarios, conferencias y pagos. Cada entidad tiene implementados los métodos CPM:
- **Create**: Crear nuevos registros
- **Process**: Procesar/Leer registros existentes
- **Modify**: Modificar registros existentes

## Tecnologías Utilizadas

- **TypeScript**: Lenguaje de programación
- **TypeORM**: ORM para TypeScript y JavaScript
- **SQLite**: Base de datos relacional
- **reflect-metadata**: Necesario para los decoradores de TypeORM

## Estructura del Proyecto

```
src/
├── app.ts                 # Archivo principal con ejemplos de uso
├── config/
│   └── data-source.ts    # Configuración de TypeORM
├── entities/             # Entidades del dominio
│   ├── Usuario.ts
│   ├── Conferencia.ts
│   └── Pago.ts
└── services/             # Servicios con métodos CPM
    ├── UsuarioService.ts
    ├── ConferenciaService.ts
    └── PagoService.ts
```

## Instalación

1. Instalar las dependencias:
```bash
npm install
```

2. Compilar el proyecto:
```bash
npm run build
```

3. Ejecutar la aplicación:
```bash
npm start
```

O ejecutar en modo desarrollo:
```bash
npm run dev
```

## Entidades del Dominio

### 1. Usuario

Representa a los usuarios del sistema que pueden registrarse y realizar pagos.

**Campos:**
- `id`: Identificador único (Primary Key)
- `nombre`: Nombre completo del usuario
- `email`: Correo electrónico (único)
- `telefono`: Número de teléfono
- `password`: Contraseña del usuario
- `fechaRegistro`: Fecha de registro en el sistema

**Relaciones:**
- Un usuario puede organizar múltiples conferencias (OneToMany)
- Un usuario puede realizar múltiples pagos (OneToMany)

**Métodos CPM:**

#### Create
```typescript
createUsuario(usuarioData: {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}): Promise<Usuario>
```

#### Process
```typescript
processUsuarios(): Promise<Usuario[]>
processUsuarioById(id: number): Promise<Usuario | null>
processUsuarioByEmail(email: string): Promise<Usuario | null>
```

#### Modify
```typescript
modifyUsuario(
  id: number,
  usuarioData: Partial<{
    nombre: string;
    email: string;
    telefono: string;
    password: string;
  }>
): Promise<Usuario | null>
```

### 2. Conferencia

Representa las conferencias que se pueden organizar y a las que los usuarios pueden inscribirse.

**Campos:**
- `id`: Identificador único (Primary Key)
- `titulo`: Título de la conferencia
- `descripcion`: Descripción detallada
- `fechaInicio`: Fecha y hora de inicio
- `fechaFin`: Fecha y hora de finalización
- `ubicacion`: Lugar donde se realiza la conferencia
- `precio`: Precio de inscripción
- `capacidadMaxima`: Número máximo de participantes
- `inscritos`: Número actual de inscritos
- `estado`: Estado de la conferencia (activa, completa, cancelada)
- `organizadorId`: ID del usuario organizador (Foreign Key)

**Relaciones:**
- Una conferencia pertenece a un organizador (ManyToOne)
- Una conferencia puede tener múltiples pagos (OneToMany)

**Métodos CPM:**

#### Create
```typescript
createConferencia(conferenciaData: {
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  precio: number;
  capacidadMaxima: number;
  organizadorId: number;
}): Promise<Conferencia>
```

#### Process
```typescript
processConferencias(): Promise<Conferencia[]>
processConferenciaById(id: number): Promise<Conferencia | null>
processConferenciasByEstado(estado: string): Promise<Conferencia[]>
```

#### Modify
```typescript
modifyConferencia(
  id: number,
  conferenciaData: Partial<{
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    ubicacion: string;
    precio: number;
    capacidadMaxima: number;
    inscritos: number;
    estado: string;
  }>
): Promise<Conferencia | null>
```

### 3. Pago

Representa los pagos realizados por los usuarios para inscribirse a conferencias.

**Campos:**
- `id`: Identificador único (Primary Key)
- `monto`: Cantidad pagada
- `metodoPago`: Método de pago utilizado (tarjeta_credito, transferencia_bancaria, etc.)
- `estado`: Estado del pago (pendiente, completado, rechazado)
- `numeroTransaccion`: Número de transacción (opcional)
- `fechaPago`: Fecha en que se realizó el pago
- `usuarioId`: ID del usuario que realiza el pago (Foreign Key)
- `conferenciaId`: ID de la conferencia asociada (Foreign Key)

**Relaciones:**
- Un pago pertenece a un usuario (ManyToOne)
- Un pago pertenece a una conferencia (ManyToOne)

**Métodos CPM:**

#### Create
```typescript
createPago(pagoData: {
  monto: number;
  metodoPago: string;
  usuarioId: number;
  conferenciaId: number;
  numeroTransaccion?: string;
}): Promise<Pago>
```

#### Process
```typescript
processPagos(): Promise<Pago[]>
processPagoById(id: number): Promise<Pago | null>
processPagosByUsuario(usuarioId: number): Promise<Pago[]>
processPagosByEstado(estado: string): Promise<Pago[]>
```

#### Modify
```typescript
modifyPago(
  id: number,
  pagoData: Partial<{
    monto: number;
    metodoPago: string;
    estado: string;
    numeroTransaccion: string;
  }>
): Promise<Pago | null>
```

## TypeORM - Conceptos Clave

### Decoradores de Entidades

TypeORM utiliza decoradores para definir las entidades y sus propiedades:

- `@Entity("nombre_tabla")`: Define una clase como entidad y especifica el nombre de la tabla
- `@PrimaryGeneratedColumn()`: Define una columna como clave primaria auto-incremental
- `@Column(options)`: Define una columna con sus opciones (tipo, longitud, etc.)
- `@ManyToOne()`: Define una relación Many-to-One
- `@OneToMany()`: Define una relación One-to-Many
- `@JoinColumn()`: Especifica la columna de la clave foránea

### DataSource (Conexión a la Base de Datos)

El `DataSource` es la configuración principal de TypeORM que define:
- Tipo de base de datos (SQLite, PostgreSQL, MySQL, etc.)
- Ubicación de la base de datos
- Entidades que se utilizarán
- Opciones de sincronización y logging

```typescript
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "conferencias.db",
  synchronize: true,
  entities: [Usuario, Conferencia, Pago],
});
```

### Repository Pattern

TypeORM utiliza el patrón Repository para acceder a los datos. Cada entidad tiene un repositorio que proporciona métodos para:
- `create()`: Crear una nueva instancia
- `save()`: Guardar una entidad (crear o actualizar)
- `find()`: Buscar múltiples registros
- `findOne()`: Buscar un registro específico
- `update()`: Actualizar registros
- `delete()`: Eliminar registros

### Relaciones

Las relaciones en TypeORM permiten conectar entidades:

1. **OneToMany**: Un usuario tiene muchas conferencias
2. **ManyToOne**: Muchas conferencias pertenecen a un usuario
3. **ManyToMany**: (No utilizado en este proyecto)

Las relaciones se cargan usando `relations` en las consultas:
```typescript
await repository.find({ relations: ["organizador", "pagos"] });
```

## Ejemplos de Uso

### Crear un Usuario
```typescript
const usuarioService = new UsuarioService();
const usuario = await usuarioService.createUsuario({
  nombre: "Juan Pérez",
  email: "juan@example.com",
  telefono: "1234567890",
  password: "password123",
});
```

### Obtener Todas las Conferencias
```typescript
const conferenciaService = new ConferenciaService();
const conferencias = await conferenciaService.processConferencias();
```

### Modificar un Pago
```typescript
const pagoService = new PagoService();
const pago = await pagoService.modifyPago(1, {
  estado: "completado"
});
```

## Base de Datos

La aplicación utiliza SQLite como base de datos, que se crea automáticamente en el archivo `conferencias.db` cuando se ejecuta la aplicación por primera vez.

Con `synchronize: true`, TypeORM crea automáticamente las tablas basándose en las entidades definidas. En producción, se recomienda usar migraciones en lugar de `synchronize`.

## Scripts Disponibles

- `npm run dev`: Ejecuta la aplicación en modo desarrollo con recarga automática
- `npm run build`: Compila el proyecto TypeScript a JavaScript
- `npm start`: Compila y ejecuta la aplicación

## Notas Importantes

1. **reflect-metadata**: Es necesario importar `reflect-metadata` al inicio de la aplicación para que los decoradores de TypeORM funcionen correctamente.

2. **Inicialización**: Antes de usar los servicios, es necesario inicializar la conexión a la base de datos con `AppDataSource.initialize()`.

3. **Cierre de Conexión**: Al finalizar, se debe cerrar la conexión con `AppDataSource.destroy()`.

4. **Sincronización**: En desarrollo, `synchronize: true` es útil, pero en producción se deben usar migraciones.

## Autor

Proyecto desarrollado para examen de dominio CPM con TypeORM.

