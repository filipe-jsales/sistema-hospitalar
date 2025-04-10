import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10 } = paginationQuery;

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
      where?: Record<string, any>;
      order?: FindOptionsOrder<T>;
    } = {},
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const { relations, where, order } = options;
    const skip = (page - 1) * limit;
    const [items, totalItems] = await repository.findAndCount({
      relations,
      where,
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