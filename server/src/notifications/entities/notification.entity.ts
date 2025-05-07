import { Category } from 'src/categories/entities/category.entity';
import { Incident } from 'src/incidents/entities/incident.entity';
import { NotifyingService } from 'src/notifying-services/entities/notifying-service.entity';
import { OrganizationalUnity } from 'src/organizational-unities/entities/organizational-unity.entity';
import { Priority } from 'src/priorities/entities/priority.entity';
import { Responsible } from 'src/responsibles/entities/responsible.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { Theme } from 'src/themes/entities/theme.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { DeadlineStatus } from '../enums/deadline.enum';
import { MedicationError } from 'src/medication-errors/entities/medication-error.entity';
import { NutritionalTherapy } from 'src/nutritional-therapy/entities/nutritional-therapy.entity';
import { Flebite } from 'src/flebite/entities/flebite.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  priorityId: number;

  @Column()
  incidentId: number;

  @Column()
  responsibleId: number;

  @Column({ unique: true })
  notificationNumber: number;

  @Column()
  organizationalUnityId: number;

  @Column()
  notifyingServiceId: number;

  @Column({ type: 'integer', nullable: true })
  incidentLocation: number;

  @Column({ type: 'timestamp', nullable: true })
  initialDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ length: 255, nullable: true })
  situation: string;

  @Column({ length: 255, nullable: true })
  anvisaNotification: string;

  @Column()
  themeId: number;

  @Column()
  categoryId: number;

  @Column()
  subcategoryId: number;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  processSEI: string;

  @Column({ nullable: true })
  observations: string;

  @Column({ nullable: true })
  actionPlan: string;

  @Column({
    type: 'enum',
    enum: DeadlineStatus,
    nullable: true,
    default: null,
  })
  deadlineStatus: DeadlineStatus;

  @Column({ unique: true })
  vigihosp: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Priority, (priority) => priority.notifications)
  priority: Priority;

  @ManyToOne(() => Incident, (incident) => incident.notifications)
  incident: Incident;

  @ManyToOne(() => Responsible, (responsible) => responsible.notifications)
  responsible: Responsible;

  @ManyToOne(
    () => OrganizationalUnity,
    (organizationalUnity) => organizationalUnity.notifications,
  )
  organizationalUnity: OrganizationalUnity;

  @ManyToOne(
    () => NotifyingService,
    (notifyingService) => notifyingService.notifications,
  )
  notifyingService: NotifyingService;

  @ManyToOne(() => Theme, (theme) => theme.notifications)
  theme: Theme;

  @ManyToOne(() => Category, (category) => category.notifications)
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.notifications)
  subcategory: Subcategory;

  @OneToMany(
    () => MedicationError,
    (medicationError) => medicationError.notification,
  )
  medicationErrors: MedicationError[];

  @OneToMany(
    () => NutritionalTherapy,
    (nutritionalTherapy) => nutritionalTherapy.notification,
  )
  nutritionalTherapy: NutritionalTherapy[];

  @OneToMany(() => Flebite, (flebite) => flebite.notification)
  flebite: Flebite[];
}
