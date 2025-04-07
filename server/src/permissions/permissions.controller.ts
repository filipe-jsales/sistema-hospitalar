import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova permissão' })
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as permissões' })
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar permissão por ID' })
  findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar permissão por ID' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover permissão por ID' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.permissionsService.remove(+id);
  }
}
