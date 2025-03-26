import { Test, TestingModule } from '@nestjs/testing';
import { NotifyingServicesService } from './notifying-services.service';

describe('NotifyingServicesService', () => {
  let service: NotifyingServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifyingServicesService],
    }).compile();

    service = module.get<NotifyingServicesService>(NotifyingServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
