# Módulo de Dominio - Entidades TypeORM

Este módulo contiene las entidades del dominio de la aplicación de conferencias implementadas con TypeORM, junto con sus DTOs (Data Transfer Objects) correspondientes.

## Estructura

```
examen/
└── dominio/
    ├── entities/              # Entidades TypeORM
    │   ├── Usuario.ts
    │   ├── Conferencia.ts
    │   ├── Agenda.ts
    │   └── index.ts
    ├── dto/                   # Data Transfer Objects
    │   ├── CrearUsuarioDto.ts
    │   ├── ActualizarUsuarioDto.ts
    │   ├── CrearConferenciaDto.ts
    │   ├── ActualizarConferenciaDto.ts
    │   ├── CrearAgendaDto.ts
    │   ├── ActualizarAgendaDto.ts
    │   └── index.ts
    └── index.ts               # Exportaciones centralizadas
```

## Entidades del Dominio

Todas las entidades utilizan UUIDs como identificadores únicos.

### Usuario
Representa a los usuarios del sistema que pueden registrarse y agendar conferencias.

**Propiedades:**
- `id`: Identificador único (UUID)
- `nombre`: Nombre completo
- `correo`: Correo electrónico (único)
- `telefono`: Número de teléfono
- `password`: Contraseña
- `fechaRegistro`: Fecha de registro

**Relaciones:**
- `conferencias`: OneToMany - Un usuario puede organizar múltiples conferencias
- `agendas`: OneToMany - Un usuario puede tener múltiples agendas

### Conferencia
Representa las conferencias que se pueden organizar.

**Propiedades:**
- `id`: Identificador único (UUID)
- `titulo`: Título de la conferencia
- `descripcion`: Descripción detallada
- `fechaInicio`: Fecha y hora de inicio
- `fechaFin`: Fecha y hora de finalización
- `ubicacion`: Lugar donde se realiza
- `precio`: Precio de inscripción
- `capacidadMaxima`: Número máximo de participantes
- `inscritos`: Número actual de inscritos
- `estado`: Estado (activa, completa, cancelada)
- `organizadorId`: ID del usuario organizador (UUID)

**Relaciones:**
- `organizador`: ManyToOne - Una conferencia pertenece a un organizador
- `agendas`: OneToMany - Una conferencia puede tener múltiples agendas

### Agenda
Representa las agendas de los usuarios para las conferencias.

**Propiedades:**
- `id`: Identificador único (UUID)
- `fechaAgendada`: Fecha y hora agendada
- `notas`: Notas opcionales
- `estado`: Estado de la agenda (pendiente, confirmada, cancelada)
- `fechaCreacion`: Fecha de creación del registro
- `usuarioId`: ID del usuario (UUID)
- `conferenciaId`: ID de la conferencia (UUID)

**Relaciones:**
- `usuario`: ManyToOne - Una agenda pertenece a un usuario
- `conferencia`: ManyToOne - Una agenda pertenece a una conferencia

## DTOs (Data Transfer Objects)

Los DTOs se utilizan para transferir datos entre capas de la aplicación sin exponer las entidades directamente.

### Usuario DTOs

#### CrearUsuarioDto
```typescript
{
  nombre: string;
  correo: string;
  telefono: string;
  password: string;
}
```

#### ActualizarUsuarioDto
```typescript
{
  nombre?: string;
  correo?: string;
  telefono?: string;
  password?: string;
}
```

### Conferencia DTOs

#### CrearConferenciaDto
```typescript
{
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  precio: number;
  capacidadMaxima: number;
  organizadorId: string; // UUID
}
```

#### ActualizarConferenciaDto
```typescript
{
  titulo?: string;
  descripcion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  ubicacion?: string;
  precio?: number;
  capacidadMaxima?: number;
  inscritos?: number;
  estado?: string;
}
```

### Agenda DTOs

#### CrearAgendaDto
```typescript
{
  fechaAgendada: Date;
  notas?: string | null;
  estado?: string;
  usuarioId: string; // UUID
  conferenciaId: string; // UUID
}
```

#### ActualizarAgendaDto
```typescript
{
  fechaAgendada?: Date;
  notas?: string | null;
  estado?: string;
}
```

## Uso

### Importar Entidades

```typescript
import { Usuario, Conferencia, Agenda } from "./examen/dominio";
```

O desde la carpeta entities:

```typescript
import { Usuario, Conferencia, Agenda } from "./examen/dominio/entities";
```

### Importar DTOs

```typescript
import {
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  CrearConferenciaDto,
  ActualizarConferenciaDto,
  CrearAgendaDto,
  ActualizarAgendaDto,
} from "./examen/dominio";
```

O desde la carpeta dto:

```typescript
import { CrearUsuarioDto } from "./examen/dominio/dto/CrearUsuarioDto";
```

## TypeORM

Estas entidades utilizan decoradores de TypeORM:
- `@Entity("nombre_tabla")`: Define la entidad y el nombre de la tabla
- `@PrimaryGeneratedColumn("uuid")`: Clave primaria UUID auto-generada
- `@Column(options)`: Define columnas con sus tipos y opciones
- `@ManyToOne()`: Relación Many-to-One
- `@OneToMany()`: Relación One-to-Many
- `@JoinColumn()`: Especifica la columna de clave foránea

### UUIDs

Todas las entidades utilizan UUIDs como identificadores:
- Los IDs son de tipo `string`
- Se generan automáticamente con `@PrimaryGeneratedColumn("uuid")`
- Las claves foráneas son de tipo `varchar(36)` para almacenar UUIDs

## Ejemplo de Uso con DTOs

```typescript
import { CrearUsuarioDto, Usuario } from "./examen/dominio";

// Crear un nuevo usuario usando DTO
const nuevoUsuarioDto: CrearUsuarioDto = {
  nombre: "Juan Pérez",
  correo: "juan@example.com",
  telefono: "1234567890",
  password: "password123",
};

// Convertir DTO a entidad (en el servicio)
const usuario = new Usuario();
Object.assign(usuario, nuevoUsuarioDto);
// El id se generará automáticamente al guardar
```

## Notas

- Este módulo contiene únicamente las entidades del dominio y sus DTOs
- No incluye servicios, controladores ni lógica de aplicación
- Es un módulo puro de dominio que define la estructura de datos y sus relaciones
- Los DTOs facilitan la validación y transferencia de datos sin exponer las entidades directamente
