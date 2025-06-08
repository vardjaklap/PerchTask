import { PrimaryKey, Model, Table, Column, AllowNull } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'Tasks',
})
class Task extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.INTEGER,
    comment: 'Unique identifier',
    autoIncrement: true,
  })
  declare id: number;


  @AllowNull(false)
  @Column({
    type: DataTypes.TEXT,
    comment: 'Title of the task',
  })
  declare title: string;
  @Column({
    type: DataTypes.TEXT,
    comment: 'Description of the task',
    
  })
  declare description: string;
  @Column({
    type: DataTypes.BOOLEAN,
    comment: 'Completion of the task',
    
  })
  declare completed: boolean;
}

export default Task;