import { Module } from '@nestjs/common';
import { NotifyingServicesService } from './notifying-services.service';
import { NotifyingServicesController } from './notifying-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyingService } from './entities/notifying-service.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotifyingService]), SharedModule],
  controllers: [NotifyingServicesController],
  providers: [NotifyingServicesService],
  exports: [NotifyingServicesService],
})
export class NotifyingServicesModule {}
