import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { SubcategoriesModule } from 'src/subcategories/subcategories.module';
import { ThemesModule } from 'src/themes/themes.module';
import { PrioritiesModule } from 'src/priorities/priorities.module';
import { IncidentsModule } from 'src/incidents/incidents.module';
import { ResponsiblesModule } from 'src/responsibles/responsibles.module';
import { OrganizationalUnitiesModule } from 'src/organizational-unities/organizational-unities.module';
import { NotifyingServicesModule } from 'src/notifying-services/notifying-services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    CategoriesModule,
    SubcategoriesModule,
    ThemesModule,
    PrioritiesModule,
    IncidentsModule,
    ResponsiblesModule,
    OrganizationalUnitiesModule,
    NotifyingServicesModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
