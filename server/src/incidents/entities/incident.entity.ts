import { Notification } from 'src/notifications/entities/notification.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Notification, (notification) => notification.incident)
  notifications: Notification[];
}
