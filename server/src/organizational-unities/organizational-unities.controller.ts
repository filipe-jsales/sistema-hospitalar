import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrganizationalUnitiesService } from './organizational-unities.service';
import { CreateOrganizationalUnityDto } from './dto/create-organizational-unity.dto';
import { UpdateOrganizationalUnityDto } from './dto/update-organizational-unity.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('organizational-unities')
@UseGuards(AuthGuard('jwt'))
export class OrganizationalUnitiesController {
  constructor(private readonly organizationalUnitiesService: OrganizationalUnitiesService) {}

  @Post()
  create(@Body() createOrganizationalUnityDto: CreateOrganizationalUnityDto) {
    return this.organizationalUnitiesService.create(createOrganizationalUnityDto);
  }

  @Get()
  findAll() {
    return this.organizationalUnitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationalUnitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationalUnityDto: UpdateOrganizationalUnityDto) {
    return this.organizationalUnitiesService.update(+id, updateOrganizationalUnityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationalUnitiesService.remove(+id);
  }
}
