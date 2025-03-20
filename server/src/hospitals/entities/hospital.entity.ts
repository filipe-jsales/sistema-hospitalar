import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeORM';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.hospital)
  users: User[];
}
