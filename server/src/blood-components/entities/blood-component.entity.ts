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
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotifyingService } from 'src/notifying-services/entities/notifying-service.entity';
import { ErrorCategory } from 'src/medication-errors/enums/error-category.enum';
import { ErrorDescription } from 'src/medication-errors/enums/error-description.enum';

@Entity()
export class BloodComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notificationId: number;

  @Column({ nullable: true })
  notifyingServiceId: number;

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

  @ManyToOne(() => Notification, (notification) => notification.bloodComponent)
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;

  @ManyToOne(
    () => NotifyingService,
    (notifyingService) => notifyingService.bloodComponent,
  )
  @JoinColumn({ name: 'notifyingServiceId' })
  notifyingService: NotifyingService;
}
