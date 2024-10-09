import { Test, TestingModule } from '@nestjs/testing';
import { VouchagramService } from './vouchagram.service';

describe('VouchagramService', () => {
  let service: VouchagramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VouchagramService],
    }).compile();

    service = module.get<VouchagramService>(VouchagramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
