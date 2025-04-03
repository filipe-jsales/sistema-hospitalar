import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { IsOptional, IsString } from 'class-validator';

@Entity('Permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  userDescription: string;

  @Column()
  @IsString()
  action: string;

  @Column()
  @IsString()
  subject: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @IsOptional()
  roles?: Role[];
}
