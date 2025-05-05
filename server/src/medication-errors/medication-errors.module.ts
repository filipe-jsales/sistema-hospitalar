import { Module } from '@nestjs/common';
import { MedicationErrorsService } from './medication-errors.service';
import { MedicationErrorsController } from './medication-errors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationError } from './entities/medication-error.entity';
import { PaginationService } from 'src/shared/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationError])],
  controllers: [MedicationErrorsController],
  providers: [MedicationErrorsService, PaginationService],
  exports: [MedicationErrorsService],
})
export class MedicationErrorsModule {}
