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
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { BloodComponentsService } from './blood-components.service';
import { CreateBloodComponentDto } from './dto/create-blood-component.dto';
import { UpdateBloodComponentDto } from './dto/update-blood-component.dto';

@Controller('blood-components')
@UseGuards(AuthGuard('jwt'))
@ApiTags('blood-components')
export class BloodComponentsController {
  constructor(
    private readonly bloodComponentsService: BloodComponentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blood components error' })
  create(@Body() createBloodComponentDto: CreateBloodComponentDto) {
    return this.bloodComponentsService.create(createBloodComponentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all blood components errors (paginated)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.bloodComponentsService.findAllPaginated(paginationQuery);
  }

  @Get('by-notification/:notificationId')
  @ApiOperation({ summary: 'Find blood components errors by notification ID' })
  findByNotification(@Param('notificationId') notificationId: string) {
    return this.bloodComponentsService.findByNotification(+notificationId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all error categories' })
  getErrorCategories() {
    return this.bloodComponentsService.getErrorCategories();
  }

  @Get('descriptions')
  @ApiOperation({ summary: 'Get all error descriptions' })
  getErrorDescriptions() {
    return this.bloodComponentsService.getErrorDescriptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find blood components error by ID' })
  findOne(@Param('id') id: string) {
    return this.bloodComponentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blood components error by ID' })
  update(
    @Param('id') id: string,
    @Body() updateBloodComponentDto: UpdateBloodComponentDto,
  ) {
    return this.bloodComponentsService.update(+id, updateBloodComponentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove blood components error by ID' })
  remove(@Param('id') id: string) {
    return this.bloodComponentsService.remove(+id);
  }
}
