import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme } from './entities/theme.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';

@Injectable()
export class ThemesService {
  constructor(
    @InjectRepository(Theme)
    private readonly themesRepository: Repository<Theme>,
    private readonly paginationService: PaginationService,
  ) {}

  create(createThemeDto: CreateThemeDto): Promise<Theme> {
    return this.themesRepository.save(createThemeDto);
  }

  findAll(): Promise<Theme[]> {
    return this.themesRepository.find();
  }

  async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<PaginatedResponse<Theme>> {
    return this.paginationService.paginateRepository(
      this.themesRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
  }

  async findAllWithQueryBuilder(paginationQuery: PaginationQueryDto): Promise<PaginatedResponse<Theme>> {
    const queryBuilder = this.themesRepository.createQueryBuilder('theme')
      .orderBy('theme.id', 'DESC');
      
    return this.paginationService.paginate(queryBuilder, paginationQuery);
  }

  async findOne(id: number): Promise<Theme> {
    const theme = await this.themesRepository.findOne({ where: { id } });

    if (!theme) {
      throw new NotFoundException(`Tema com ID ${id} não encontrado`);
    }
    return theme;
  }

  async update(id: number, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    await this.findOne(id);
    await this.themesRepository.update(id, updateThemeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const theme = await this.findOne(id);
    await this.themesRepository.softRemove(theme);
    return { message: `Tema com ID ${id} removido` };
  }
}
