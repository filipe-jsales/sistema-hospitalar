import { Module } from '@nestjs/common';
import { NutritionalTherapyService } from './nutritional-therapy.service';
import { NutritionalTherapyController } from './nutritional-therapy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionalTherapy } from './entities/nutritional-therapy.entity';
import { PaginationService } from 'src/shared/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([NutritionalTherapy])],
  controllers: [NutritionalTherapyController],
  providers: [NutritionalTherapyService, PaginationService],
  exports: [NutritionalTherapyService],
})
export class NutritionalTherapyModule {}
