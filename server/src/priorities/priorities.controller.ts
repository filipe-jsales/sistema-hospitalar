import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrioritiesService } from './priorities.service';
import { CreatePriorityDto } from './dto/create-priority.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('priorities')
@UseGuards(AuthGuard('jwt'))
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) {}

  @Post()
  create(@Body() createPriorityDto: CreatePriorityDto) {
    return this.prioritiesService.create(createPriorityDto);
  }

  @Get()
  findAll() {
    return this.prioritiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prioritiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePriorityDto: UpdatePriorityDto) {
    return this.prioritiesService.update(+id, updatePriorityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prioritiesService.remove(+id);
  }
}
