import { Test, TestingModule } from '@nestjs/testing';
import { CashFreeService } from './cash-free.service';

describe('CashFreeService', () => {
  let service: CashFreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashFreeService],
    }).compile();

    service = module.get<CashFreeService>(CashFreeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
