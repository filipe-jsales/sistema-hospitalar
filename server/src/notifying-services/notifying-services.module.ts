import { Module } from '@nestjs/common';
import { NotifyingServicesService } from './notifying-services.service';
import { NotifyingServicesController } from './notifying-services.controller';

@Module({
  controllers: [NotifyingServicesController],
  providers: [NotifyingServicesService],
})
export class NotifyingServicesModule {}
