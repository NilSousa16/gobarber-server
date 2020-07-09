import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterProviderFieldToProviderId1593304377061 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('appointments', 'provider');

      await queryRunner.addColumn('appointments', new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
      }));

      await queryRunner.createForeignKey('appointments', new TableForeignKey({
        // nome da foreign key
        name: 'AppointmentsProvider',
        // coluna na tabela appointments que vai representar a foreign key
        columnNames:['provider_id'],
        // coluna que possui o id usado para referência
        referencedColumnNames:['id'],
        // tabela a ser referenciada
        referencedTableName: 'users',
        // caso o user for deletado
        onDelete: 'SET NULL',
        // caso o id seja alterado
        onUpdate: 'CASCADE',
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'AppointmentsProvider');

      await queryRunner.dropColumn('appointments', 'provider_id');

      await queryRunner.addColumn('appointments', new TableColumn({
        name: 'provider',
        type: 'varchar',
      }))

    }

}
