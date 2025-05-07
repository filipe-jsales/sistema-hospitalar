import { Test, TestingModule } from '@nestjs/testing';
import { FlebiteService } from './flebite.service';

describe('FlebiteService', () => {
  let service: FlebiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlebiteService],
    }).compile();

    service = module.get<FlebiteService>(FlebiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
