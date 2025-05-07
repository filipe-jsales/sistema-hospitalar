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
import { NutritionalTherapyService } from './nutritional-therapy.service';
import { CreateNutritionalTherapyDto } from './dto/create-nutritional-therapy.dto';
import { UpdateNutritionalTherapyDto } from './dto/update-nutritional-therapy.dto';

@Controller('nutritional-therapy')
@UseGuards(AuthGuard('jwt'))
@ApiTags('nutritional-therapy')
export class NutritionalTherapyController {
  constructor(
    private readonly nutritionalTherapyService: NutritionalTherapyService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new nutritional therapy error' })
  create(@Body() createNutritionalTherapyDto: CreateNutritionalTherapyDto) {
    return this.nutritionalTherapyService.create(createNutritionalTherapyDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all nutritional therapy errors (paginated)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.nutritionalTherapyService.findAllPaginated(paginationQuery);
  }

  @Get('by-notification/:notificationId')
  @ApiOperation({
    summary: 'Find nutritional therapy errors by notification ID',
  })
  findByNotification(@Param('notificationId') notificationId: string) {
    return this.nutritionalTherapyService.findByNotification(+notificationId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all error categories' })
  getErrorCategories() {
    return this.nutritionalTherapyService.getErrorCategories();
  }

  @Get('descriptions')
  @ApiOperation({ summary: 'Get all error descriptions' })
  getErrorDescriptions() {
    return this.nutritionalTherapyService.getErrorDescriptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find nutritional therapy error by ID' })
  findOne(@Param('id') id: string) {
    return this.nutritionalTherapyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update nutritional therapy error by ID' })
  update(
    @Param('id') id: string,
    @Body() updateNutritionalTherapyDto: UpdateNutritionalTherapyDto,
  ) {
    return this.nutritionalTherapyService.update(
      +id,
      updateNutritionalTherapyDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove nutritional therapy error by ID' })
  remove(@Param('id') id: string) {
    return this.nutritionalTherapyService.remove(+id);
  }
}
