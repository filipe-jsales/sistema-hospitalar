import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';
import { OrganizationalUnity } from 'src/organizational-unities/entities/organizational-unity.entity';

@Entity('Responsible')
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  cpf: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];

  @OneToMany(() => OrganizationalUnity, (organizationalUnity) => organizationalUnity.responsible)
  organizationalUnities: OrganizationalUnity[];
}
