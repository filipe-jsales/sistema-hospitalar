import { Module } from '@nestjs/common';
import { NotifyingServicesService } from './notifying-services.service';
import { NotifyingServicesController } from './notifying-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyingService } from './entities/notifying-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotifyingService])],
  controllers: [NotifyingServicesController],
  providers: [NotifyingServicesService],
  exports: [NotifyingServicesService],
})
export class NotifyingServicesModule {}
