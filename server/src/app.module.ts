import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { CaslModule } from './casl/casl.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { Permission } from './permissions/entities/permission.entity';

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
        username: configService.get<string>('MYSQL_ROOT_USER'),
        password: configService.get<string>('MYSQL_ROOT_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [User, Role, Permission],
        synchronize: true,
      }),
    }),
    UsersModule,
    EmailTemplatesModule,
    CaslModule,
    RolesModule,
    PermissionsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
