import { Module } from '@nestjs/common';
import { FlebiteService } from './flebite.service';
import { PaginationService } from 'src/shared/services/pagination.service';
import { Flebite } from './entities/flebite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlebiteController } from './flebite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Flebite])],
  controllers: [FlebiteController],
  providers: [FlebiteService, PaginationService],
  exports: [FlebiteService],
})
export class FlebiteModule {}
