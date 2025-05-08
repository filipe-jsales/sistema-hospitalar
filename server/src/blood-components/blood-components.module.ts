import { Module } from '@nestjs/common';
import { BloodComponentsService } from './blood-components.service';
import { BloodComponentsController } from './blood-components.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { BloodComponent } from './entities/blood-component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloodComponent])],
  controllers: [BloodComponentsController],
  providers: [BloodComponentsService, PaginationService],
  exports: [BloodComponentsService],
})
export class BloodComponentsModule {}
