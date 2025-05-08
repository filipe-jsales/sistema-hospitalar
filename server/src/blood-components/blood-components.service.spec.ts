import { Test, TestingModule } from '@nestjs/testing';
import { BloodComponentsService } from './blood-components.service';

describe('BloodComponentsService', () => {
  let service: BloodComponentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloodComponentsService],
    }).compile();

    service = module.get<BloodComponentsService>(BloodComponentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
