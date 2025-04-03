import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @IsOptional()
  users?: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  @IsOptional()
  permissions?: Permission[];
}
