import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('Subcategory')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;
  
  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];
}
