import { DataSource } from "typeorm";
import { Usuario, Conferencia, Agenda } from "../../../dominio/entities";

const dataSource = new DataSource({
  type: "sqlite",
  database: "conferencias.db",
  entities: [Usuario, Conferencia, Agenda],
  synchronize: true,
});

async function seed() {
  console.log("🌱 Iniciando proceso de seed...\n");

  await dataSource.initialize();
  console.log("✅ Conexión a la base de datos establecida\n");

  // Limpiar tablas existentes
  await dataSource.getRepository(Agenda).clear();
  await dataSource.getRepository(Conferencia).clear();
  await dataSource.getRepository(Usuario).clear();
  console.log("🧹 Tablas limpiadas\n");

  // ==================== USUARIOS ====================
  const usuarioRepository = dataSource.getRepository(Usuario);
  
  const usuarios = [
    {
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      telefono: "0991234567",
      password: "password123",
    },
    {
      nombre: "María García",
      correo: "maria@example.com",
      telefono: "0987654321",
      password: "password123",
    },
    {
      nombre: "Carlos López",
      correo: "carlos@example.com",
      telefono: "0976543210",
      password: "password123",
    },
    {
      nombre: "Ana Martínez",
      correo: "ana@example.com",
      telefono: "0965432109",
      password: "password123",
    },
    {
      nombre: "Pedro Sánchez",
      correo: "pedro@example.com",
      telefono: "0954321098",
      password: "password123",
    },
  ];

  const usuariosCreados = await usuarioRepository.save(usuarios);
  console.log("👥 Usuarios creados:");
  usuariosCreados.forEach((u) => console.log(`   - ${u.nombre} (${u.id})`));
  console.log();

  // ==================== CONFERENCIAS ====================
  const conferenciaRepository = dataSource.getRepository(Conferencia);

  const conferencias = [
    {
      titulo: "Introducción a TypeScript",
      descripcion: "Aprende los fundamentos de TypeScript desde cero",
      fechaInicio: new Date("2025-12-01T09:00:00"),
      fechaFin: new Date("2025-12-01T17:00:00"),
      ubicacion: "Sala A - Centro de Convenciones",
      precio: 50.00,
      capacidadMaxima: 100,
      inscritos: 45,
      estado: "activa",
      organizadorId: usuariosCreados[0].id,
    },
    {
      titulo: "NestJS Avanzado",
      descripcion: "Patrones de diseño y arquitectura en NestJS",
      fechaInicio: new Date("2025-12-05T10:00:00"),
      fechaFin: new Date("2025-12-05T18:00:00"),
      ubicacion: "Auditorio Principal",
      precio: 75.00,
      capacidadMaxima: 80,
      inscritos: 80,
      estado: "activa",
      organizadorId: usuariosCreados[1].id,
    },
    {
      titulo: "GraphQL con Apollo",
      descripcion: "Implementación de APIs GraphQL con Apollo Server",
      fechaInicio: new Date("2025-12-10T08:00:00"),
      fechaFin: new Date("2025-12-10T14:00:00"),
      ubicacion: "Sala Virtual - Zoom",
      precio: 30.00,
      capacidadMaxima: 200,
      inscritos: 120,
      estado: "activa",
      organizadorId: usuariosCreados[2].id,
    },
    {
      titulo: "Docker y Kubernetes",
      descripcion: "Contenedores y orquestación para desarrolladores",
      fechaInicio: new Date("2025-12-15T09:00:00"),
      fechaFin: new Date("2025-12-15T17:00:00"),
      ubicacion: "Sala B - Centro de Convenciones",
      precio: 60.00,
      capacidadMaxima: 50,
      inscritos: 35,
      estado: "activa",
      organizadorId: usuariosCreados[3].id,
    },
    {
      titulo: "Testing en Node.js",
      descripcion: "Pruebas unitarias e integración con Jest",
      fechaInicio: new Date("2025-12-20T10:00:00"),
      fechaFin: new Date("2025-12-20T16:00:00"),
      ubicacion: "Laboratorio de Computación",
      precio: 40.00,
      capacidadMaxima: 30,
      inscritos: 28,
      estado: "activa",
      organizadorId: usuariosCreados[4].id,
    },
  ];

  const conferenciasCreadas = await conferenciaRepository.save(conferencias);
  console.log("📅 Conferencias creadas:");
  conferenciasCreadas.forEach((c) => console.log(`   - ${c.titulo} (${c.id})`));
  console.log();

  // ==================== AGENDAS ====================
  const agendaRepository = dataSource.getRepository(Agenda);

  const agendas = [
    {
      fechaAgendada: new Date("2025-12-01T09:30:00"),
      notas: "Llevar laptop con Node.js instalado",
      estado: "confirmada",
      usuarioId: usuariosCreados[1].id,
      conferenciaId: conferenciasCreadas[0].id,
    },
    {
      fechaAgendada: new Date("2025-12-05T10:00:00"),
      notas: "Repasar patrones de diseño antes",
      estado: "pendiente",
      usuarioId: usuariosCreados[0].id,
      conferenciaId: conferenciasCreadas[1].id,
    },
    {
      fechaAgendada: new Date("2025-12-10T08:00:00"),
      notas: "Tener Apollo Studio configurado",
      estado: "confirmada",
      usuarioId: usuariosCreados[2].id,
      conferenciaId: conferenciasCreadas[2].id,
    },
    {
      fechaAgendada: new Date("2025-12-15T09:00:00"),
      notas: "Instalar Docker Desktop",
      estado: "pendiente",
      usuarioId: usuariosCreados[3].id,
      conferenciaId: conferenciasCreadas[3].id,
    },
    {
      fechaAgendada: new Date("2025-12-20T10:00:00"),
      notas: "Preparar proyecto de ejemplo para testing",
      estado: "confirmada",
      usuarioId: usuariosCreados[4].id,
      conferenciaId: conferenciasCreadas[4].id,
    },
  ];

  const agendasCreadas = await agendaRepository.save(agendas);
  console.log("📋 Agendas creadas:");
  agendasCreadas.forEach((a) => console.log(`   - Agenda ${a.id} (${a.estado})`));
  console.log();

  // ==================== RESUMEN ====================
  console.log("═".repeat(50));
  console.log("📊 RESUMEN DE SEED:");
  console.log("═".repeat(50));
  console.log(`   👥 Usuarios:      ${usuariosCreados.length}`);
  console.log(`   📅 Conferencias:  ${conferenciasCreadas.length}`);
  console.log(`   📋 Agendas:       ${agendasCreadas.length}`);
  console.log("═".repeat(50));
  console.log("\n✅ Seed completado exitosamente!\n");

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error("❌ Error durante el seed:", error);
  process.exit(1);
});
