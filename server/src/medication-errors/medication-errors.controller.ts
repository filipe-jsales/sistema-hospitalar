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
import { MedicationErrorsService } from './medication-errors.service';
import { CreateMedicationErrorDto } from './dto/create-medication-error.dto';
import { UpdateMedicationErrorDto } from './dto/update-medication-error.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('medication-errors')
@UseGuards(AuthGuard('jwt'))
@ApiTags('medication-errors')
export class MedicationErrorsController {
  constructor(
    private readonly medicationErrorsService: MedicationErrorsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medication error' })
  create(@Body() createMedicationErrorDto: CreateMedicationErrorDto) {
    return this.medicationErrorsService.create(createMedicationErrorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all medication errors (paginated)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.medicationErrorsService.findAllPaginated(paginationQuery);
  }

  @Get('by-notification/:notificationId')
  @ApiOperation({ summary: 'Find medication errors by notification ID' })
  findByNotification(@Param('notificationId') notificationId: string) {
    return this.medicationErrorsService.findByNotification(+notificationId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all error categories' })
  getErrorCategories() {
    return this.medicationErrorsService.getErrorCategories();
  }

  @Get('descriptions')
  @ApiOperation({ summary: 'Get all error descriptions' })
  getErrorDescriptions() {
    return this.medicationErrorsService.getErrorDescriptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find medication error by ID' })
  findOne(@Param('id') id: string) {
    return this.medicationErrorsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update medication error by ID' })
  update(
    @Param('id') id: string,
    @Body() updateMedicationErrorDto: UpdateMedicationErrorDto,
  ) {
    return this.medicationErrorsService.update(+id, updateMedicationErrorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove medication error by ID' })
  remove(@Param('id') id: string) {
    return this.medicationErrorsService.remove(+id);
  }
}
