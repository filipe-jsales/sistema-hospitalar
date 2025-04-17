import { Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  Repository,
  SelectQueryBuilder,
  Raw,
  FindOptionsWhere,
} from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10, year, months } = paginationQuery;

    if (year) {
      if (months && months.length > 0) {
        const dateConditions = months
          .map((month) => {
            return `EXTRACT(YEAR FROM "createdAt") = ${year} AND EXTRACT(MONTH FROM "createdAt") = ${month}`;
          })
          .join(' OR ');

        queryBuilder.andWhere(`(${dateConditions})`);
      } else {
        queryBuilder.andWhere(`EXTRACT(YEAR FROM "createdAt") = :year`, {
          year,
        });
      }
    }

    const skip = (page - 1) * limit;
    const countQueryBuilder = queryBuilder.clone();
    const totalItems = await countQueryBuilder.getCount();

    const items = await queryBuilder.skip(skip).take(limit).getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async paginateRepository<T>(
    repository: Repository<T>,
    paginationQuery: PaginationQueryDto,
    options: {
      relations?: string[];
      where?: FindOptionsWhere<T>;
      order?: FindOptionsOrder<T>;
      dateField?: string;
    } = {},
  ): Promise<PaginatedResponse<T>> {
    const {
      page = 1,
      limit = 10,
      year,
      months,
      responsibleId,
    } = paginationQuery;
    const { relations, where = {}, order, dateField = 'createdAt' } = options;
    const skip = (page - 1) * limit;
    const whereConditions = { ...where };

    if (year) {
      if (months && months.length > 0) {
        whereConditions[dateField] = Raw((alias) => {
          const conditions = months
            .map((month) => {
              return `EXTRACT(YEAR FROM ${alias}) = ${year} AND EXTRACT(MONTH FROM ${alias}) = ${month}`;
            })
            .join(' OR ');
          return `(${conditions})`;
        });
      } else {
        whereConditions[dateField] = Raw(
          (alias) => `EXTRACT(YEAR FROM ${alias}) = ${year}`,
        );
      }
    }

    if (responsibleId) {
      whereConditions['responsibleId'] = responsibleId;
    }

    const [items, totalItems] = await repository.findAndCount({
      relations,
      where: whereConditions,
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
