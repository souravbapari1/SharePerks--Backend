import { Test, TestingModule } from '@nestjs/testing';
import { WhoowService } from './whoow.service';

describe('WhoowService', () => {
  let service: WhoowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhoowService],
    }).compile();

    service = module.get<WhoowService>(WhoowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
