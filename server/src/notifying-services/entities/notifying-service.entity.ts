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
import { MedicationError } from 'src/medication-errors/entities/medication-error.entity';

@Entity()
export class NotifyingService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];
  @OneToMany(
    () => MedicationError,
    (medicationError) => medicationError.notifyingService,
  )
  medicationErrors: MedicationError[];
}
