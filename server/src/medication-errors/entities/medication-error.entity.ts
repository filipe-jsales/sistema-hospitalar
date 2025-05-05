import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ErrorCategory } from '../enums/error-category.enum';
import { ErrorDescription } from '../enums/error-description.enum';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity()
export class MedicationError {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notificationId: number;

  @Column({
    type: 'enum',
    enum: ErrorCategory,
  })
  errorCategory: ErrorCategory;

  @Column({
    type: 'enum',
    enum: ErrorDescription,
    nullable: true,
  })
  errorDescription: ErrorDescription;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(
    () => Notification,
    (notification) => notification.medicationErrors,
  )
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;
}
