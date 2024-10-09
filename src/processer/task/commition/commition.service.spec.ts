import { Test, TestingModule } from '@nestjs/testing';
import { CommitionService } from './commition.service';

describe('CommitionService', () => {
  let service: CommitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommitionService],
    }).compile();

    service = module.get<CommitionService>(CommitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
