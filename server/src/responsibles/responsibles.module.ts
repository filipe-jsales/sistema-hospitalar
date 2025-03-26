import { Module } from '@nestjs/common';
import { ResponsiblesService } from './responsibles.service';
import { ResponsiblesController } from './responsibles.controller';

@Module({
  controllers: [ResponsiblesController],
  providers: [ResponsiblesService],
})
export class ResponsiblesModule {}
