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
import { FlebiteService } from './flebite.service';
import { CreateFlebiteDto } from './dto/create-flebite.dto';
import { UpdateFlebiteDto } from './dto/update-flebite.dto';

@Controller('flebite')
@UseGuards(AuthGuard('jwt'))
@ApiTags('flebite')
export class FlebiteController {
  constructor(private readonly flebiteService: FlebiteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flebite error' })
  create(@Body() createFlebiteDto: CreateFlebiteDto) {
    return this.flebiteService.create(createFlebiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all flebite errors (paginated)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.flebiteService.findAllPaginated(paginationQuery);
  }

  @Get('by-notification/:notificationId')
  @ApiOperation({ summary: 'Find flebite errors by notification ID' })
  findByNotification(@Param('notificationId') notificationId: string) {
    return this.flebiteService.findByNotification(+notificationId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all error categories' })
  getErrorCategories() {
    return this.flebiteService.getErrorCategories();
  }

  @Get('descriptions')
  @ApiOperation({ summary: 'Get all error descriptions' })
  getErrorDescriptions() {
    return this.flebiteService.getErrorDescriptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find flebite error by ID' })
  findOne(@Param('id') id: string) {
    return this.flebiteService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update flebite error by ID' })
  update(@Param('id') id: string, @Body() updateFlebiteDto: UpdateFlebiteDto) {
    return this.flebiteService.update(+id, updateFlebiteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove flebite error by ID' })
  remove(@Param('id') id: string) {
    return this.flebiteService.remove(+id);
  }
}
