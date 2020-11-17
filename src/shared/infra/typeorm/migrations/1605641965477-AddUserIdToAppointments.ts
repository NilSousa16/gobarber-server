import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AddUserIdToAppointments1605641965477 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey('appointments', new TableForeignKey({
      // nome da foreign key
      name: 'AppointmentUser',
      // coluna na tabela appointments que vai representar a foreign key
      columnNames:['user_id'],
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

    await queryRunner.dropColumn('appointments', 'user_id');

  }

}
