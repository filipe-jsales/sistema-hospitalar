import { Module } from '@nestjs/common';
import { OrganizationalUnitiesService } from './organizational-unities.service';
import { OrganizationalUnitiesController } from './organizational-unities.controller';

@Module({
  controllers: [OrganizationalUnitiesController],
  providers: [OrganizationalUnitiesService],
})
export class OrganizationalUnitiesModule {}
