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
import { FlebiteClassification, FlebiteRiskLevel } from '../enums/flebite.enum';

@Entity()
export class Flebite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notificationId: number;

  @Column({ nullable: true })
  notifyingServiceId: number;

  @Column({
    type: 'enum',
    enum: FlebiteClassification,
  })
  classification: FlebiteClassification;

  @Column({
    type: 'enum',
    enum: FlebiteRiskLevel,
    nullable: true,
  })
  riskLevel: FlebiteRiskLevel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Notification, (notification) => notification.flebite)
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;

  @ManyToOne(
    () => NotifyingService,
    (notifyingService) => notifyingService.flebiteErrors,
  )
  @JoinColumn({ name: 'notifyingServiceId' })
  notifyingService: NotifyingService;
}
