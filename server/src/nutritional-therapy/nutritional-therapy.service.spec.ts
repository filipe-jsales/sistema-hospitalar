import { Test, TestingModule } from '@nestjs/testing';
import { NutritionalTherapyService } from './nutritional-therapy.service';

describe('NutritionalTherapyService', () => {
  let service: NutritionalTherapyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionalTherapyService],
    }).compile();

    service = module.get<NutritionalTherapyService>(NutritionalTherapyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
