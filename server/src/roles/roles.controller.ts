import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CheckPolicies, Public } from '../casl/casl-ability.factory/policies.decorator';
import { Role } from './entities/role.entity';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from 'src/casl/casl-ability.factory/policies.guard';
import { Action } from 'src/casl/casl-ability.factory/action.enum';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Public()
  async create(@Body() createRoleDto: RoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Create, Role))
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.rolesService.remove(+id);
  }
}
