#!/usr/bin/env node

/**
 * Script de Verificación de Requisitos de Arquitectura
 * Verifica que el proyecto cumpla con todos los requisitos del taller
 */

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

let errors = [];
let warnings = [];
let passed = [];

function log(message, type = 'info') {
  const prefix = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
  }[type];
  console.log(`${prefix} ${message}`);
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    passed.push(description);
    log(`${description}`, 'success');
    return true;
  } else {
    errors.push(`Falta: ${description} (${filePath})`);
    log(`${description} - NO ENCONTRADO`, 'error');
    return false;
  }
}

function checkFileContains(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(pattern)) {
      passed.push(description);
      log(`${description}`, 'success');
      return true;
    } else {
      warnings.push(`Posible problema: ${description}`);
      log(`${description} - NO ENCONTRADO`, 'warning');
      return false;
    }
  } catch (error) {
    errors.push(`Error al leer: ${description} (${filePath})`);
    log(`${description} - ERROR AL LEER`, 'error');
    return false;
  }
}

function checkNoFileContains(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(pattern)) {
      passed.push(description);
      log(`${description}`, 'success');
      return true;
    } else {
      errors.push(`Violación: ${description}`);
      log(`${description} - VIOLACIÓN ENCONTRADA`, 'error');
      return false;
    }
  } catch (error) {
    // Si el archivo no existe, no es un error
    return true;
  }
}

function checkDirectoryStructure() {
  console.log('\n📁 Verificando Estructura de Directorios...\n');
  
  const baseDir = path.join(__dirname, '..');
  
  checkFileExists(
    path.join(baseDir, 'api-gateway'),
    'Directorio api-gateway existe'
  );
  checkFileExists(
    path.join(baseDir, 'microservicio-arquitecto'),
    'Directorio microservicio-arquitecto existe'
  );
  checkFileExists(
    path.join(baseDir, 'microservicio-verificacion'),
    'Directorio microservicio-verificacion existe'
  );
  checkFileExists(
    path.join(baseDir, 'docker-compose.yml'),
    'Archivo docker-compose.yml existe'
  );
}

function checkAPIGateway() {
  console.log('\n🌐 Verificando API Gateway...\n');
  
  const gatewayDir = path.join(__dirname, '..', 'api-gateway');
  
  checkFileExists(
    path.join(gatewayDir, 'src', 'main.ts'),
    'API Gateway: main.ts existe'
  );
  checkFileExists(
    path.join(gatewayDir, 'src', 'app.module.ts'),
    'API Gateway: app.module.ts existe'
  );
  
  // Verificar que expone endpoints REST
  const controllers = [
    path.join(gatewayDir, 'src', 'arquitecto', 'arquitecto.controller.ts'),
    path.join(gatewayDir, 'src', 'verificacion', 'verificacion.controller.ts'),
  ];
  
  controllers.forEach(controller => {
    if (fs.existsSync(controller)) {
      checkFileContains(controller, '@Controller', 'API Gateway: Controlador REST encontrado');
      checkFileContains(controller, 'ClientProxy', 'API Gateway: Usa ClientProxy para RabbitMQ');
    }
  });
  
  // Verificar módulos que configuran Transport.RMQ
  const modules = [
    path.join(gatewayDir, 'src', 'arquitecto', 'arquitecto.module.ts'),
    path.join(gatewayDir, 'src', 'verificacion', 'verificacion.module.ts'),
  ];
  
  modules.forEach(module => {
    if (fs.existsSync(module)) {
      checkFileContains(module, 'Transport.RMQ', 'API Gateway: Módulo configurado con Transport.RMQ');
    }
  });
  
  // Verificar que NO tiene base de datos propia
  checkNoFileContains(
    path.join(gatewayDir, 'package.json'),
    'typeorm',
    'API Gateway: No tiene TypeORM (correcto, no debe tener BD)'
  );
}

function checkMicroservicioArquitecto() {
  console.log('\n🏗️  Verificando Microservicio Arquitecto (Entidad Maestra)...\n');
  
  const arquitectoDir = path.join(__dirname, '..', 'microservicio-arquitecto');
  
  checkFileExists(
    path.join(arquitectoDir, 'src', 'main.ts'),
    'Microservicio Arquitecto: main.ts existe'
  );
  
  // Verificar base de datos independiente
  checkFileContains(
    path.join(arquitectoDir, 'package.json'),
    'typeorm',
    'Microservicio Arquitecto: Tiene TypeORM (BD independiente)'
  );
  
  checkFileContains(
    path.join(arquitectoDir, 'package.json'),
    'pg',
    'Microservicio Arquitecto: Tiene PostgreSQL driver'
  );
  
  // Verificar RabbitMQ
  checkFileContains(
    path.join(arquitectoDir, 'package.json'),
    'amqplib',
    'Microservicio Arquitecto: Tiene amqplib'
  );
  
  // Verificar que publica eventos
  const rabbitmqService = path.join(arquitectoDir, 'src', 'rabbitmq', 'rabbitmq.service.ts');
  if (fs.existsSync(rabbitmqService)) {
    checkFileContains(rabbitmqService, 'publishEvent', 'Microservicio Arquitecto: Publica eventos RabbitMQ');
  }
  
  // Verificar que escucha mensajes
  const controller = path.join(arquitectoDir, 'src', 'arquitecto', 'arquitecto.controller.ts');
  if (fs.existsSync(controller)) {
    checkFileContains(controller, '@MessagePattern', 'Microservicio Arquitecto: Escucha mensajes RabbitMQ');
  }
}

function checkMicroservicioVerificacion() {
  console.log('\n✅ Verificando Microservicio Verificación (Entidad Transaccional)...\n');
  
  const verificacionDir = path.join(__dirname, '..', 'microservicio-verificacion');
  
  checkFileExists(
    path.join(verificacionDir, 'src', 'main.ts'),
    'Microservicio Verificación: main.ts existe'
  );
  
  // Verificar base de datos independiente
  checkFileContains(
    path.join(verificacionDir, 'package.json'),
    'typeorm',
    'Microservicio Verificación: Tiene TypeORM (BD independiente)'
  );
  
  checkFileContains(
    path.join(verificacionDir, 'package.json'),
    'pg',
    'Microservicio Verificación: Tiene PostgreSQL driver'
  );
  
  // Verificar RabbitMQ
  checkFileContains(
    path.join(verificacionDir, 'package.json'),
    'amqplib',
    'Microservicio Verificación: Tiene amqplib'
  );
  
  // Verificar que se comunica con Arquitecto vía RabbitMQ
  const verificacionService = path.join(verificacionDir, 'src', 'verificacion', 'verificacion.service.ts');
  if (fs.existsSync(verificacionService)) {
    checkFileContains(verificacionService, 'rabbitMQService', 'Microservicio Verificación: Usa RabbitMQService');
    checkFileContains(verificacionService, 'sendMessage', 'Microservicio Verificación: Envía mensajes a Arquitecto');
    checkFileContains(verificacionService, 'publishEvent', 'Microservicio Verificación: Publica eventos');
  }
  
  // Verificar que NO hay comunicación HTTP directa
  checkNoFileContains(
    verificacionService,
    'http://localhost:3001',
    'Microservicio Verificación: NO tiene comunicación HTTP directa con Arquitecto'
  );
  
  checkNoFileContains(
    verificacionService,
    'HttpService',
    'Microservicio Verificación: NO usa HttpService para comunicación directa'
  );
  
  checkNoFileContains(
    verificacionService,
    'axios',
    'Microservicio Verificación: NO usa axios para comunicación directa'
  );
}

function checkIdempotentConsumer() {
  console.log('\n🔄 Verificando Consumidor Idempotente...\n');
  
  const verificacionDir = path.join(__dirname, '..', 'microservicio-verificacion');
  
  // Verificar Redis
  checkFileContains(
    path.join(verificacionDir, 'package.json'),
    'ioredis',
    'Microservicio Verificación: Tiene ioredis (Redis)'
  );
  
  checkFileExists(
    path.join(verificacionDir, 'src', 'redis', 'redis.service.ts'),
    'Microservicio Verificación: Servicio Redis existe'
  );
  
  // Verificar implementación de idempotencia
  const redisService = path.join(verificacionDir, 'src', 'redis', 'redis.service.ts');
  if (fs.existsSync(redisService)) {
    checkFileContains(redisService, 'checkIdempotency', 'Redis Service: Tiene método checkIdempotency');
    checkFileContains(redisService, 'saveIdempotency', 'Redis Service: Tiene método saveIdempotency');
  }
  
  const verificacionService = path.join(verificacionDir, 'src', 'verificacion', 'verificacion.service.ts');
  if (fs.existsSync(verificacionService)) {
    checkFileContains(verificacionService, 'redisService', 'Verificación Service: Usa RedisService');
    checkFileContains(verificacionService, 'idempotency_key', 'Verificación Service: Maneja idempotency_key');
  }
  
  // Verificar docker-compose tiene Redis
  const dockerCompose = path.join(__dirname, '..', 'docker-compose.yml');
  if (fs.existsSync(dockerCompose)) {
    checkFileContains(dockerCompose, 'redis:', 'Docker Compose: Tiene servicio Redis');
  }
}

function checkDockerCompose() {
  console.log('\n🐳 Verificando Docker Compose...\n');
  
  const dockerCompose = path.join(__dirname, '..', 'docker-compose.yml');
  
  if (fs.existsSync(dockerCompose)) {
    checkFileContains(dockerCompose, 'rabbitmq:', 'Docker Compose: Tiene servicio RabbitMQ');
    checkFileContains(dockerCompose, 'postgres-arquitecto:', 'Docker Compose: Tiene PostgreSQL para Arquitecto');
    checkFileContains(dockerCompose, 'postgres-verificacion:', 'Docker Compose: Tiene PostgreSQL para Verificación');
    checkFileContains(dockerCompose, 'redis:', 'Docker Compose: Tiene servicio Redis');
  }
}

function checkDocumentation() {
  console.log('\n📚 Verificando Documentación...\n');
  
  const baseDir = path.join(__dirname, '..');
  
  checkFileExists(
    path.join(baseDir, 'README.md'),
    'README.md existe'
  );
  
  checkFileExists(
    path.join(baseDir, 'INICIO_RAPIDO.md'),
    'INICIO_RAPIDO.md existe'
  );
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(60));
  
  console.log(`\n${colors.green}✓ Pasados: ${passed.length}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Advertencias: ${warnings.length}${colors.reset}`);
  console.log(`${colors.red}✗ Errores: ${errors.length}${colors.reset}`);
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}Advertencias:${colors.reset}`);
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  
  if (errors.length > 0) {
    console.log(`\n${colors.red}Errores encontrados:${colors.reset}`);
    errors.forEach(e => console.log(`  - ${e}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (errors.length === 0) {
    console.log(`${colors.green}✅ ¡Todos los requisitos principales están cumplidos!${colors.reset}`);
    if (warnings.length > 0) {
      console.log(`${colors.yellow}⚠️  Revisa las advertencias para asegurar una implementación completa.${colors.reset}`);
    }
    return 0;
  } else {
    console.log(`${colors.red}❌ Hay errores que deben corregirse antes de la entrega.${colors.reset}`);
    return 1;
  }
}

// Ejecutar verificaciones
console.log(`${colors.blue}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║  Verificación de Requisitos de Arquitectura - Semana 10  ║${colors.reset}`);
console.log(`${colors.blue}╚══════════════════════════════════════════════════════════╝${colors.reset}`);

checkDirectoryStructure();
checkAPIGateway();
checkMicroservicioArquitecto();
checkMicroservicioVerificacion();
checkIdempotentConsumer();
checkDockerCompose();
checkDocumentation();

const exitCode = printSummary();
process.exit(exitCode);

