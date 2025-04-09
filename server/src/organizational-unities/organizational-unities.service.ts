import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationalUnityDto } from './dto/create-organizational-unity.dto';
import { UpdateOrganizationalUnityDto } from './dto/update-organizational-unity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationalUnity } from './entities/organizational-unity.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/interfaces/paginated-response.dto';
import { PaginationService } from 'src/shared/services/pagination.service';

@Injectable()
export class OrganizationalUnitiesService {
  constructor(
    @InjectRepository(OrganizationalUnity)
    private readonly organizationalUnityRepository: Repository<OrganizationalUnity>,
    private readonly paginationService: PaginationService,
  ) {}
  create(
    createOrganizationalUnityDto: CreateOrganizationalUnityDto,
  ): Promise<OrganizationalUnity> {
    return this.organizationalUnityRepository.save(
      createOrganizationalUnityDto,
    );
  }

  findAll(): Promise<OrganizationalUnity[]> {
    return this.organizationalUnityRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<OrganizationalUnity>> {
    return this.paginationService.paginateRepository(
      this.organizationalUnityRepository,
      paginationQuery,
      {
        order: { id: 'DESC' },
      },
    );
  }

  async findOne(id: number): Promise<OrganizationalUnity> {
    const organizationalUnity =
      await this.organizationalUnityRepository.findOne({
        where: { id },
      });
    if (!organizationalUnity) {
      throw new NotFoundException(
        `Unidade organizacional com ID ${id} não encontrada`,
      );
    }
    return organizationalUnity;
  }

  async update(
    id: number,
    updateOrganizationalUnityDto: UpdateOrganizationalUnityDto,
  ): Promise<OrganizationalUnity> {
    await this.findOne(id);
    await this.organizationalUnityRepository.update(
      id,
      updateOrganizationalUnityDto,
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const organizationalUnity = await this.findOne(id);
    await this.organizationalUnityRepository.softRemove(organizationalUnity);
    return { message: `Unidade organizacional com ID ${id} removida` };
  }
}
