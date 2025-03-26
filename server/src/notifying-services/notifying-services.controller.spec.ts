import { Test, TestingModule } from '@nestjs/testing';
import { NotifyingServicesController } from './notifying-services.controller';
import { NotifyingServicesService } from './notifying-services.service';

describe('NotifyingServicesController', () => {
  let controller: NotifyingServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifyingServicesController],
      providers: [NotifyingServicesService],
    }).compile();

    controller = module.get<NotifyingServicesController>(NotifyingServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
