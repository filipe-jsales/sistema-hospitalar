import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Responsible } from 'src/responsibles/entities/responsible.entity';

@Entity('OrganizationalUnity')
export class OrganizationalUnity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  acronym: string;

  @Column({ nullable: false })
  managerId: number;

  @Column({ length: 255, nullable: true })
  organizationalAcronym: string;

  @Column({ length: 255, nullable: true })
  organizationalUnitType: string;

  @Column({ length: 255 })
  managementGroup: string;

  @Column({ length: 255, nullable: true })
  divisionalGrouping: string;

  @Column({ length: 255, nullable: true })
  sectorGrouping: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Notification, (notification) => notification.priority)
  notifications: Notification[];

  @ManyToOne(
    () => Responsible,
    (responsible) => responsible.organizationalUnities,
  )
  @JoinColumn({ name: 'managerId' })
  responsible: Responsible;
}
