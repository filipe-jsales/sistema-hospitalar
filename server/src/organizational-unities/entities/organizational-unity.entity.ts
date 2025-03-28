import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity('OrganizationalUnity')
export class OrganizationalUnity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  acronym: string;

  @Column({ length: 10, nullable: true })
  manager: string;

  @Column({ length: 255, nullable: true })
  organizationalChart: string;

  @Column({ length: 255, nullable: true })
  organizationalUnitType: string;

  @Column({ length: 255 })
  managementGroup: string;

  @Column({ length: 255, nullable: true })
  divisionalGrouping: string;

  @Column({ length: 255, nullable: true })
  sectorGrouping: string;

  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];
}
