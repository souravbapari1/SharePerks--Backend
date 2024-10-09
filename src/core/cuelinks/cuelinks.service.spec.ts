import { Test, TestingModule } from '@nestjs/testing';
import { CuelinksService } from './cuelinks.service';

describe('CuelinksService', () => {
  let service: CuelinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuelinksService],
    }).compile();

    service = module.get<CuelinksService>(CuelinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
