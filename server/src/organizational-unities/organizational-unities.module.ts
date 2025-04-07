import { Module } from '@nestjs/common';
import { OrganizationalUnitiesService } from './organizational-unities.service';
import { OrganizationalUnitiesController } from './organizational-unities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalUnity } from './entities/organizational-unity.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationalUnity]), SharedModule],
  controllers: [OrganizationalUnitiesController],
  providers: [OrganizationalUnitiesService],
  exports: [OrganizationalUnitiesService],
})
export class OrganizationalUnitiesModule {}
