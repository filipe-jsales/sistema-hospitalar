import { Notification } from 'src/notifications/entities/notification.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('Incident')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column()
  description: string;

  @Column()
  treatmentStartDate: number;

  @Column()
  conclusionDate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Notification, (notification) => notification.incident)
  notifications: Notification[];
}
