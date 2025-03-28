import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('Priority')
export class Priority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  name: string;

  @Column()
  numericalPriority: number;

  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];
}
