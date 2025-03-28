import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotifyingServiceDto } from './dto/create-notifying-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifyingService } from './entities/notifying-service.entity';
import { Repository } from 'typeorm';
import { UpdateNotifyingServiceDto } from './dto/update-notifying-service.dto';

@Injectable()
export class NotifyingServicesService {
  constructor(
    @InjectRepository(NotifyingService)
    private readonly notifyingServicesRepository: Repository<NotifyingService>,
    // TODO: add CaslAbilityFactory?
    // TODO: add nest logger
  ) {}

  create(
    createNotifyingServiceDto: CreateNotifyingServiceDto,
  ): Promise<NotifyingService> {
    return this.notifyingServicesRepository.save(createNotifyingServiceDto);
  }

  findAll(): Promise<NotifyingService[]> {
    return this.notifyingServicesRepository.find();
  }

  async findOne(id: number): Promise<NotifyingService> {
    const notifyingService = await this.notifyingServicesRepository.findOne({
      where: { id },
    });

    if (!notifyingService) {
      throw new NotFoundException(`NotifyingService with ID ${id} not found`);
    }

    return notifyingService;
  }

  async update(
    id: number,
    updateNotifyingServiceDto: UpdateNotifyingServiceDto,
  ): Promise<NotifyingService> {
    const notifyingService = this.findOne(id);

    if (notifyingService) {
      await this.notifyingServicesRepository.update(
        id,
        updateNotifyingServiceDto,
      );
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const notifyingService = await this.findOne(id);
    await this.notifyingServicesRepository.softRemove(notifyingService);
    return { message: `Serviço notificante ${id} removido com sucesso` };
  }
}
