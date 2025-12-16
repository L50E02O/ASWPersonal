import { MigrationInterface, QueryRunner, Table, Check } from 'typeorm';

/**
 * Migración para crear la tabla de verificaciones
 */
export class CreateVerificaciones1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'verificaciones',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '20',
            default: "'pendiente'",
            isNullable: false,
          },
          {
            name: 'fecha_verificacion',
            type: 'date',
            default: 'CURRENT_DATE',
            isNullable: false,
          },
          {
            name: 'arquitecto_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'moderador_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_verificaciones_arquitecto_id',
            columnNames: ['arquitecto_id'],
            isUnique: true,
          },
          {
            name: 'IDX_verificaciones_moderador_id',
            columnNames: ['moderador_id'],
          },
        ],
        checks: [
          {
            name: 'CHK_verificaciones_estado',
            expression: "estado IN ('pendiente', 'verificado', 'rechazado')",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('verificaciones');
  }
}

