import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme } from './entities/theme.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponseWithGrouping } from 'src/shared/interfaces/paginated-response.dto';

interface GroupedResult {
  name: string;
  count: number;
}

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

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseWithGrouping<Theme>> {
    const paginatedData = await this.paginationService.paginateRepository(
      this.themesRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
        dateField: 'createdAt',
      },
    );

    let groupedQueryBuilder = this.themesRepository
      .createQueryBuilder('theme')
      .select('theme.name', 'name')
      .addSelect('COUNT(theme.id)', 'count')
      .where('theme.deletedAt IS NULL');

    if (paginationQuery.year) {
      if (paginationQuery.months && paginationQuery.months.length > 0) {
        const dateConditions = paginationQuery.months
          .map((month) => {
            return `EXTRACT(YEAR FROM theme.createdAt) = ${paginationQuery.year} AND EXTRACT(MONTH FROM theme.createdAt) = ${month}`;
          })
          .join(' OR ');

        groupedQueryBuilder.andWhere(`(${dateConditions})`);
      } else {
        groupedQueryBuilder.andWhere(
          `EXTRACT(YEAR FROM theme.createdAt) = :year`,
          { year: paginationQuery.year },
        );
      }
    }

    const groupedResults = await groupedQueryBuilder
      .groupBy('theme.name')
      .getRawMany<GroupedResult>();

    const groupedData = groupedResults.reduce(
      (acc, item) => {
        acc[item.name] = parseInt(item.count as unknown as string, 10);
        return acc;
      },
      {} as { [key: string]: number },
    );

    return {
      ...paginatedData,
      groupedData,
    };
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
