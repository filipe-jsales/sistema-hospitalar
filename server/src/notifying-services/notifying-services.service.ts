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

  create(createNotifyingServiceDto: CreateNotifyingServiceDto) {
    return this.notifyingServicesRepository.save(createNotifyingServiceDto);
  }

  findAll() {
    return this.notifyingServicesRepository.find();
  }

  async findOne(id: number) {
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
  ) {
    const notifyingService = this.notifyingServicesRepository.findOne({
      where: { id },
    });

    if (!notifyingService) {
      throw new NotFoundException(`Serviço notificante ${id} não encontrado`);
    }

    await this.notifyingServicesRepository.update(
      id,
      updateNotifyingServiceDto,
    );
    return this.findOne(id);
  }

  async remove(id: number) {
    const notifyingService = await this.findOne(id);
    await this.notifyingServicesRepository.softRemove(notifyingService);
    return { message: `Serviço notificante ${id} removido com sucesso` };
  }
}
