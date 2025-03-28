import { Notification } from 'src/notifications/entities/notification.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('Theme')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @OneToMany(() => Notification, notification => notification.theme)
  notifications: Notification[];
}