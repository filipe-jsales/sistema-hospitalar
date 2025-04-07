import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from 'src/casl/casl-ability.factory/policies.guard';
import { CheckPolicies } from 'src/casl/casl-ability.factory/policies.decorator';
import { Action } from 'src/casl/casl-ability.factory/action.enum';
import { Hospital } from './entities/hospital.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('hospitals')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo hospital' })
  @CheckPolicies((ability) => ability.can(Action.Create, Hospital))
  create(@Body() createHospitalDto: CreateHospitalDto, @Request() req) {
    return this.hospitalsService.create(createHospitalDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os hospitais' })
  @CheckPolicies((ability) => ability.can(Action.Read, Hospital))
  findAll(@Request() req) {
    return this.hospitalsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar hospital por ID' })
  @CheckPolicies((ability) => ability.can(Action.Read, Hospital))
  findOne(@Param('id') id: string, @Request() req) {
    return this.hospitalsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar hospital por ID' })
  @CheckPolicies((ability) => ability.can(Action.Update, Hospital))
  update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
    @Request() req,
  ) {
    return this.hospitalsService.update(+id, updateHospitalDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover hospital por ID' })
  @CheckPolicies((ability) => ability.can(Action.Delete, Hospital))
  remove(@Param('id') id: string, @Request() req) {
    return this.hospitalsService.remove(+id, req.user);
  }
}
