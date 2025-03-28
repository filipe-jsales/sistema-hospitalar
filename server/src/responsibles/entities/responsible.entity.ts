import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('Responsible')
export class Responsible {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  cpf: string;

  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];
}
