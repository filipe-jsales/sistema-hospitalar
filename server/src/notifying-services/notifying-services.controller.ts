import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotifyingServicesService } from './notifying-services.service';
import { CreateNotifyingServiceDto } from './dto/create-notifying-service.dto';
import { UpdateNotifyingServiceDto } from './dto/update-notifying-service.dto';

@Controller('notifying-services')
export class NotifyingServicesController {
  constructor(private readonly notifyingServicesService: NotifyingServicesService) {}

  @Post()
  create(@Body() createNotifyingServiceDto: CreateNotifyingServiceDto) {
    return this.notifyingServicesService.create(createNotifyingServiceDto);
  }

  @Get()
  findAll() {
    return this.notifyingServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notifyingServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotifyingServiceDto: UpdateNotifyingServiceDto) {
    return this.notifyingServicesService.update(+id, updateNotifyingServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notifyingServicesService.remove(+id);
  }
}
