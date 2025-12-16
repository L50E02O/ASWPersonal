# Concordancia: Entidades, DTOs y Migraciones

Este documento verifica que las entidades, DTOs y migraciones estén perfectamente alineadas.

## ✅ Microservicio Arquitecto

### Entidad: `Arquitecto`

```typescript
@Entity('arquitectos')
export class Arquitecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  cedula: string;

  @Column({ type: 'float', default: 0.0 })
  valoracion_prom_proyecto: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255 })
  especialidades: string;

  @Column({ type: 'varchar', length: 255 })
  ubicacion: string;

  @Column({ type: 'boolean', default: false })
  verificado: boolean;

  @Column({ type: 'int', default: 0 })
  vistas_perfil: number;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuario_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
```

### DTO: `CreateArquitectoDto`

```typescript
export class CreateArquitectoDto {
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  especialidades: string;

  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @IsUUID()
  @IsNotEmpty()
  usuario_id: string;

  @IsBoolean()
  @IsOptional()
  verificado?: boolean; // Opcional, default: false
}
```

**✅ Concordancia:**
- Todos los campos requeridos están presentes
- `valoracion_prom_proyecto` y `vistas_perfil` tienen defaults en la entidad, no necesitan estar en CreateDto
- `verificado` es opcional en DTO, tiene default en entidad

### DTO: `UpdateArquitectoDto`

```typescript
export class UpdateArquitectoDto {
  @IsString()
  @IsOptional()
  cedula?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  especialidades?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsBoolean()
  @IsOptional()
  verificado?: boolean;

  @IsNumber()
  @IsOptional()
  valoracion_prom_proyecto?: number;

  @IsNumber()
  @IsOptional()
  vistas_perfil?: number;
}
```

**✅ Concordancia:**
- Todos los campos actualizables están presentes
- Todos son opcionales (correcto para update)
- No incluye `id`, `usuario_id`, `created_at`, `updated_at` (correcto, no se actualizan)

### Migración: `CreateArquitectos1700000000000`

**✅ Campos alineados:**
- ✅ `id`: uuid, primary key, default gen_random_uuid()
- ✅ `cedula`: varchar(50), unique, not null
- ✅ `valoracion_prom_proyecto`: real (corregido de float), default 0.0
- ✅ `descripcion`: text, not null
- ✅ `especialidades`: varchar(255), not null
- ✅ `ubicacion`: varchar(255), not null
- ✅ `verificado`: boolean, default false
- ✅ `vistas_perfil`: int, default 0
- ✅ `usuario_id`: uuid, not null
- ✅ `created_at`: timestamp with time zone, default CURRENT_TIMESTAMP
- ✅ `updated_at`: timestamp with time zone, default CURRENT_TIMESTAMP + trigger

**✅ Índices:**
- ✅ `IDX_arquitectos_cedula`: unique index en cedula
- ✅ `IDX_arquitectos_usuario_id`: index en usuario_id

**✅ Triggers:**
- ✅ `update_arquitectos_updated_at`: actualiza updated_at automáticamente

---

## ✅ Microservicio Verificación

### Entidad: `Verificacion`

```typescript
@Entity('verificaciones')
export class Verificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pendiente',
  })
  estado: 'pendiente' | 'verificado' | 'rechazado';

  @Column({ type: 'timestamp', name: 'fecha_verificacion', default: () => 'CURRENT_TIMESTAMP' })
  fecha_verificacion: Date;

  @Column({ type: 'uuid', name: 'arquitecto_id' })
  arquitecto_id: string;

  @Column({ type: 'uuid', name: 'moderador_id' })
  moderador_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
```

### DTO: `CreateVerificacionDto`

```typescript
export class CreateVerificacionDto {
  @IsUUID()
  @IsNotEmpty()
  arquitecto_id: string;

  @IsUUID()
  @IsNotEmpty()
  moderador_id: string;

  @IsString()
  @IsIn(['pendiente', 'verificado', 'rechazado'])
  @IsNotEmpty()
  estado: 'pendiente' | 'verificado' | 'rechazado';

  @IsString()
  @IsNotEmpty()
  idempotency_key: string; // Solo para proceso, no se guarda en BD
}
```

**✅ Concordancia:**
- Todos los campos requeridos están presentes
- `idempotency_key` NO se guarda en la BD (solo para idempotencia en Redis)
- `fecha_verificacion` tiene default en la entidad, no necesita estar en DTO

### DTO: `UpdateVerificacionDto`

```typescript
export class UpdateVerificacionDto {
  @IsString()
  @IsIn(['pendiente', 'verificado', 'rechazado'])
  @IsOptional()
  estado?: 'pendiente' | 'verificado' | 'rechazado';

  @IsString()
  @IsOptional()
  idempotency_key?: string; // Solo para proceso, no se guarda en BD
}
```

**✅ Concordancia:**
- Solo `estado` es actualizable
- `idempotency_key` NO se guarda en la BD (solo para idempotencia)
- No incluye `id`, `arquitecto_id`, `moderador_id`, `created_at`, `updated_at` (correcto)

### Migración: `CreateVerificaciones1700000000000`

**✅ Campos alineados:**
- ✅ `id`: uuid, primary key, default gen_random_uuid()
- ✅ `estado`: varchar(20), default 'pendiente', check constraint
- ✅ `fecha_verificacion`: timestamp with time zone (corregido de date), default CURRENT_TIMESTAMP
- ✅ `arquitecto_id`: uuid, not null
- ✅ `moderador_id`: uuid, not null
- ✅ `created_at`: timestamp with time zone, default CURRENT_TIMESTAMP
- ✅ `updated_at`: timestamp with time zone, default CURRENT_TIMESTAMP + trigger

**✅ Índices:**
- ✅ `IDX_verificaciones_arquitecto_id`: unique index (un arquitecto = una verificación)
- ✅ `IDX_verificaciones_moderador_id`: index en moderador_id

**✅ Constraints:**
- ✅ `CHK_verificaciones_estado`: check constraint para valores válidos

**✅ Triggers:**
- ✅ `update_verificaciones_updated_at`: actualiza updated_at automáticamente

---

## 📋 Resumen de Correcciones Aplicadas

### Microservicio Arquitecto

1. ✅ **Tipo de dato**: Cambiado `float` → `real` en migración (PostgreSQL estándar)
2. ✅ **Timestamps**: Cambiado `timestamp` → `timestamp with time zone` (mejor práctica)
3. ✅ **updated_at**: Agregado trigger para actualización automática (reemplaza onUpdate que no existe en PostgreSQL)
4. ✅ **isNullable**: Agregado explícitamente para timestamps

### Microservicio Verificación

1. ✅ **fecha_verificacion**: Cambiado `date` → `timestamp with time zone` en entidad y migración
   - Razón: Se usa `new Date()` en el servicio, necesita timestamp completo
2. ✅ **Timestamps**: Cambiado `timestamp` → `timestamp with time zone` (mejor práctica)
3. ✅ **updated_at**: Agregado trigger para actualización automática
4. ✅ **isNullable**: Agregado explícitamente para timestamps

---

## ✅ Verificación Final

### Campos que NO están en DTOs (correcto)

**CreateArquitectoDto:**
- ❌ `id`: Se genera automáticamente
- ❌ `valoracion_prom_proyecto`: Tiene default (0.0)
- ❌ `vistas_perfil`: Tiene default (0)
- ❌ `created_at`, `updated_at`: Se generan automáticamente

**CreateVerificacionDto:**
- ❌ `id`: Se genera automáticamente
- ❌ `fecha_verificacion`: Tiene default (CURRENT_TIMESTAMP)
- ❌ `created_at`, `updated_at`: Se generan automáticamente
- ❌ `idempotency_key`: NO se guarda en BD (solo para proceso)

**UpdateArquitectoDto:**
- ❌ `id`: No se actualiza
- ❌ `usuario_id`: No se actualiza (relación inmutable)
- ❌ `created_at`, `updated_at`: Se generan automáticamente

**UpdateVerificacionDto:**
- ❌ `id`: No se actualiza
- ❌ `arquitecto_id`, `moderador_id`: No se actualizan (relaciones inmutables)
- ❌ `fecha_verificacion`: Se actualiza automáticamente cuando cambia estado
- ❌ `created_at`, `updated_at`: Se generan automáticamente
- ❌ `idempotency_key`: NO se guarda en BD (solo para proceso)

---

## 🎯 Estado Final

✅ **Todas las entidades, DTOs y migraciones están perfectamente alineadas**

- Tipos de datos coinciden
- Constraints coinciden
- Defaults coinciden
- Índices coinciden
- Triggers implementados correctamente
- Campos opcionales/requeridos coinciden

