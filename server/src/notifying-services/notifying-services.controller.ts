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
import { NotifyingServicesService } from './notifying-services.service';
import { CreateNotifyingServiceDto } from './dto/create-notifying-service.dto';
import { UpdateNotifyingServiceDto } from './dto/update-notifying-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('notifying-services')
@UseGuards(AuthGuard('jwt'))
export class NotifyingServicesController {
  constructor(
    private readonly notifyingServicesService: NotifyingServicesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo serviço notificante' })
  create(@Body() createNotifyingServiceDto: CreateNotifyingServiceDto) {
    return this.notifyingServicesService.create(createNotifyingServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas os serviços notificantes (paginado)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.notifyingServicesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar serviço notificante por ID' })
  findOne(@Param('id') id: string) {
    return this.notifyingServicesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar serviço notificante por ID' })
  update(
    @Param('id') id: string,
    @Body() updateNotifyingServiceDto: UpdateNotifyingServiceDto,
  ) {
    return this.notifyingServicesService.update(+id, updateNotifyingServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover serviço notificante por ID' })
  remove(@Param('id') id: string) {
    return this.notifyingServicesService.remove(+id);
  }
}
