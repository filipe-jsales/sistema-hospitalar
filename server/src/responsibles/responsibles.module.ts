import { Module } from '@nestjs/common';
import { ResponsiblesService } from './responsibles.service';
import { ResponsiblesController } from './responsibles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Responsible } from './entities/responsible.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Responsible])],
  controllers: [ResponsiblesController],
  providers: [ResponsiblesService],
})
export class ResponsiblesModule {}
