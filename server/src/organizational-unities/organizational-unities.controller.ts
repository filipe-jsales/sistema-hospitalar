import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrganizationalUnitiesService } from './organizational-unities.service';
import { CreateOrganizationalUnityDto } from './dto/create-organizational-unity.dto';
import { UpdateOrganizationalUnityDto } from './dto/update-organizational-unity.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('organizational-unities')
@UseGuards(AuthGuard('jwt'))
export class OrganizationalUnitiesController {
  constructor(
    private readonly organizationalUnitiesService: OrganizationalUnitiesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova unidade organizacional' })
  create(@Body() createOrganizationalUnityDto: CreateOrganizationalUnityDto) {
    return this.organizationalUnitiesService.create(
      createOrganizationalUnityDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos as unidades organizacionais (paginado)',
  })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.organizationalUnitiesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar unidade organizacional por ID' })
  findOne(@Param('id') id: string) {
    return this.organizationalUnitiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar unidade organizacional por ID' })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationalUnityDto: UpdateOrganizationalUnityDto,
  ) {
    return this.organizationalUnitiesService.update(
      +id,
      updateOrganizationalUnityDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover unidade organizacional por ID' })
  remove(@Param('id') id: string) {
    return this.organizationalUnitiesService.remove(+id);
  }
}
