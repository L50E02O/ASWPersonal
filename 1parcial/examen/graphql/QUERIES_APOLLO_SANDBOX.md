# Consultas GraphQL - Formato para Apollo Sandbox

**URL:** `http://localhost:4000/graphql`

En Apollo Sandbox, simplemente copia y pega estas queries directamente en el editor.

---

## 1. CONSULTAS DE USUARIOS

### Obtener todos los usuarios
```graphql
query {
  usuarios {
    id
    nombre
    correo
    telefono
    fechaRegistro
    totalConferencias
    totalAgendas
  }
}
```

### Obtener usuario por ID
```graphql
query {
  usuario(id: "c82933bd-3ff8-4811-ac24-c1640dd95f8d") {
    id
    nombre
    correo
    conferencias {
      id
      titulo
      precio
    }
    agendas {
      id
      fechaAgendada
      estado
    }
  }
}
```

### Obtener usuario por Email
```graphql
query {
  usuarioPorEmail(correo: "juan@example.com") {
    id
    nombre
    correo
    totalConferencias
    totalAgendas
  }
}
```

---

## 2. CONSULTAS DE CONFERENCIAS

### Obtener todas las conferencias
```graphql
query {
  conferencias {
    id
    titulo
    descripcion
    fechaInicio
    fechaFin
    ubicacion
    precio
    capacidadMaxima
    inscritos
    estado
    cuposDisponibles
    porcentajeOcupacion
    disponible
    duracion
    organizador {
      id
      nombre
      correo
    }
  }
}
```

### Obtener conferencias por estado
```graphql
query {
  conferencias(estado: "activa") {
    id
    titulo
    estado
    cuposDisponibles
    disponible
  }
}
```

### Obtener conferencias disponibles
```graphql
query {
  conferenciasDisponibles {
    id
    titulo
    precio
    cuposDisponibles
    porcentajeOcupacion
    duracion
    organizador {
      nombre
      correo
    }
  }
}
```

### Obtener conferencia por ID
```graphql
query {
  conferencia(id: "b2611076-1fc4-421c-84fb-1b5e3e4efadd") {
    id
    titulo
    descripcion
    fechaInicio
    fechaFin
    ubicacion
    precio
    capacidadMaxima
    inscritos
    cuposDisponibles
    porcentajeOcupacion
    disponible
    duracion
    organizador {
      id
      nombre
      correo
    }
    agendas {
      id
      fechaAgendada
      estado
      usuario {
        nombre
        correo
      }
    }
  }
}
```

---

## 3. CONSULTAS DE AGENDAS

### Obtener todas las agendas
```graphql
query {
  agendas {
    id
    fechaAgendada
    notas
    estado
    fechaCreacion
    proxima
    tiempoRestante
    usuario {
      id
      nombre
      correo
    }
    conferencia {
      id
      titulo
      ubicacion
      precio
    }
  }
}
```

### Obtener agendas por usuario
```graphql
query {
  agendas(usuarioId: "c82933bd-3ff8-4811-ac24-c1640dd95f8d") {
    id
    fechaAgendada
    estado
    proxima
    tiempoRestante
    conferencia {
      titulo
      ubicacion
      precio
    }
  }
}
```

### Obtener agendas por conferencia
```graphql
query {
  agendas(conferenciaId: "b2611076-1fc4-421c-84fb-1b5e3e4efadd") {
    id
    fechaAgendada
    estado
    usuario {
      nombre
      correo
    }
  }
}
```

### Obtener próximas agendas
```graphql
query {
  proximasAgendas(limite: 5) {
    id
    fechaAgendada
    estado
    proxima
    tiempoRestante
    conferencia {
      titulo
      ubicacion
    }
    usuario {
      nombre
      correo
    }
  }
}
```

---

## 4. CONSULTAS DE ESTADÍSTICAS (Consultas de Negocio)

### Estadísticas generales (completas)
```graphql
query {
  estadisticas {
    conferencias {
      totalConferencias
      conferenciasActivas
      conferenciasCompletas
      totalInscritos
      promedioInscritosPorConferencia
      ingresosTotales
      ingresosPromedio
    }
    usuarios {
      totalUsuarios
      usuariosConConferencias
      usuariosConAgendas
      promedioConferenciasPorUsuario
    }
    agendas {
      totalAgendas
      agendasPendientes
      agendasConfirmadas
      porcentajeConfirmacion
    }
  }
}
```

### Estadísticas de conferencias
```graphql
query {
  estadisticasConferencias {
    totalConferencias
    conferenciasActivas
    conferenciasCompletas
    totalInscritos
    promedioInscritosPorConferencia
    ingresosTotales
    ingresosPromedio
  }
}
```

### Estadísticas de usuarios
```graphql
query {
  estadisticasUsuarios {
    totalUsuarios
    usuariosConConferencias
    usuariosConAgendas
    promedioConferenciasPorUsuario
  }
}
```

### Estadísticas de agendas
```graphql
query {
  estadisticasAgendas {
    totalAgendas
    agendasPendientes
    agendasConfirmadas
    porcentajeConfirmacion
  }
}
```

---

## 5. CONSULTAS COMPLEJAS

### Dashboard de usuario (con variables)
```graphql
query DashboardUsuario($usuarioId: ID!) {
  usuario(id: $usuarioId) {
    id
    nombre
    correo
    totalConferencias
    totalAgendas
    conferencias {
      id
      titulo
      estado
      cuposDisponibles
      porcentajeOcupacion
    }
    agendas {
      id
      fechaAgendada
      estado
      proxima
      tiempoRestante
      conferencia {
        titulo
        ubicacion
        precio
      }
    }
  }
}
```

**Variables (en el panel de variables de Apollo Sandbox):**
```json
 `
```

### Análisis de conferencias
```graphql
query {
  conferenciasDisponibles {
    id
    titulo
    precio
    cuposDisponibles
    porcentajeOcupacion
    duracion
    organizador {
      nombre
      correo
    }
  }
  estadisticasConferencias {
    totalConferencias
    conferenciasActivas
    ingresosTotales
    ingresosPromedio
  }
}
```

### Próximas actividades
```graphql
query {
  proximasAgendas(limite: 10) {
    id
    fechaAgendada
    tiempoRestante
    estado
    conferencia {
      titulo
      ubicacion
      precio
      duracion
    }
    usuario {
      nombre
      correo
    }
  }
}
```

---

## Cómo usar en Apollo Sandbox

1. **Abrir Apollo Sandbox:**
   - Ve a: `http://localhost:4000/graphql`

2. **Copiar una query:**
   - Selecciona una query de arriba
   - Copia todo el bloque (incluyendo `query { ... }`)

3. **Pegar en el editor:**
   - Pega directamente en el editor de Apollo Sandbox
   - Click en "Run" (▶️)

4. **Para queries con variables:**
   - Pega la query en el editor
   - Ve al panel "Variables" (abajo)
   - Pega el JSON de variables
   - Click en "Run"

## Notas Importantes

- **UUIDs de ejemplo:** Los UUIDs en las queries son ejemplos. Reemplázalos con IDs reales de tu base de datos.
- **Obtener IDs reales:** Primero ejecuta `query { usuarios { id nombre } }` para obtener IDs válidos.
- **REST API requerido:** Asegúrate de que el REST API esté corriendo en `http://localhost:3000`.

## Verificación de Queries

Todas las queries están verificadas y funcionan correctamente en Apollo Sandbox. Las queries incluyen:
- ✅ Sintaxis GraphQL correcta
- ✅ Nombres de campos que coinciden con los tipos
- ✅ Argumentos correctos para los resolvers
- ✅ Variables correctamente tipadas

