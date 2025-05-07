import { Test, TestingModule } from '@nestjs/testing';
import { FlebiteController } from './flebite.controller';
import { FlebiteService } from './flebite.service';

describe('FlebiteController', () => {
  let controller: FlebiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlebiteController],
      providers: [FlebiteService],
    }).compile();

    controller = module.get<FlebiteController>(FlebiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
