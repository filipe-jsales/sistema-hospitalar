import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoriesRepository: Repository<Subcategory>,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const category = await this.categoriesService.findOne(
      createSubcategoryDto.categoryId,
    );
    const subcategory = this.subcategoriesRepository.create({
      name: createSubcategoryDto.name,
      category: category,
      categoryId: createSubcategoryDto.categoryId,
    });

    return this.subcategoriesRepository.save(subcategory);
  }

  findAll(): Promise<Subcategory[]> {
    return this.subcategoriesRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Subcategory>> {
    return this.paginationService.paginateRepository(
      this.subcategoriesRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
  }

  async findOne(id: number): Promise<Subcategory> {
    const subcategory = this.subcategoriesRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }
    return subcategory;
  }

  async update(
    id: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    await this.subcategoriesRepository.update(id, updateSubcategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const subcategory = await this.findOne(id);
    await this.subcategoriesRepository.softRemove(subcategory);
    return { message: `Subcategory ${id} removed` };
  }
}
