import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { CaslModule } from './casl/casl.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';
import { PoliciesGuard } from './casl/casl-ability.factory/policies.guard';
import { ThemesModule } from './themes/themes.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { IncidentsModule } from './incidents/incidents.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { CategoriesModule } from './categories/categories.module';
import { NotifyingServicesModule } from './notifying-services/notifying-services.module';
import { OrganizationalUnitiesModule } from './organizational-unities/organizational-unities.module';
import { ResponsiblesModule } from './responsibles/responsibles.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT') || 3306,
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    EmailTemplatesModule,
    CaslModule,
    RolesModule,
    PermissionsModule,
    HospitalsModule,
    AuthModule,
    ThemesModule,
    PrioritiesModule,
    IncidentsModule,
    SubcategoriesModule,
    CategoriesModule,
    NotifyingServicesModule,
    OrganizationalUnitiesModule,
    ResponsiblesModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
