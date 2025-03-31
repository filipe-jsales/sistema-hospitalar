import { Module } from '@nestjs/common';
import { OrganizationalUnitiesService } from './organizational-unities.service';
import { OrganizationalUnitiesController } from './organizational-unities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalUnity } from './entities/organizational-unity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationalUnity])],
  controllers: [OrganizationalUnitiesController],
  providers: [OrganizationalUnitiesService],
  exports: [OrganizationalUnitiesService],
})
export class OrganizationalUnitiesModule {}
