import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { PermissionSeedService } from './seed/permission-seed.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionSeedService, RolesService],
  exports: [PermissionsService, PermissionSeedService],
})
export class PermissionsModule {}
