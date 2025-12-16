import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migración para crear la tabla de arquitectos
 */
export class CreateArquitectos1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'arquitectos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'cedula',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'valoracion_prom_proyecto',
            type: 'float',
            default: 0.0,
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'especialidades',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'ubicacion',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'verificado',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'vistas_perfil',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'usuario_id',
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
            name: 'IDX_arquitectos_cedula',
            columnNames: ['cedula'],
            isUnique: true,
          },
          {
            name: 'IDX_arquitectos_usuario_id',
            columnNames: ['usuario_id'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('arquitectos');
  }
}

