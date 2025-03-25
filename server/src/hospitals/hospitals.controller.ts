import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { AuthGuard } from '@nestjs/passport';
import { PoliciesGuard } from 'src/casl/casl-ability.factory/policies.guard';
import { CheckPolicies } from 'src/casl/casl-ability.factory/policies.decorator';
import { Action } from 'src/casl/casl-ability.factory/action.enum';
import { Hospital } from './entities/hospital.entity';

@Controller('hospitals')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, Hospital))
  create(@Body() createHospitalDto: CreateHospitalDto, @Request() req) {
    return this.hospitalsService.create(createHospitalDto, req.user);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, Hospital))
  findAll(@Request() req) {
    return this.hospitalsService.findAll(req.user);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, Hospital))
  findOne(@Param('id') id: string, @Request() req) {
    return this.hospitalsService.findOne(+id, req.user);
  }
  
  @Put(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, Hospital))
  update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
    @Request() req,
  ) {
    return this.hospitalsService.update(+id, updateHospitalDto, req.user);
  }
  
  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, Hospital))
  remove(@Param('id') id: string, @Request() req) {
    return this.hospitalsService.remove(+id, req.user);
  }
}
