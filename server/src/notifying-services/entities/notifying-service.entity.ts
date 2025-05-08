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
import { NutritionalTherapy } from 'src/nutritional-therapy/entities/nutritional-therapy.entity';
import { Flebite } from 'src/flebite/entities/flebite.entity';
import { BloodComponent } from 'src/blood-components/entities/blood-component.entity';

@Entity()
export class NotifyingService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @OneToMany(
    () => NutritionalTherapy,
    (nutritionalTherapy) => nutritionalTherapy.notifyingService,
  )
  nutritionalTherapyErrors: NutritionalTherapy[];

  @OneToMany(() => Flebite, (flebite) => flebite.notifyingService)
  flebiteErrors: Flebite[];

  @OneToMany(
    () => BloodComponent,
    (bloodComponent) => bloodComponent.notifyingService,
  )
  bloodComponent: BloodComponent[];
}
