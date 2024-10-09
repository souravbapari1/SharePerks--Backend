import { Test, TestingModule } from '@nestjs/testing';
import { AppcontentService } from './appcontent.service';

describe('AppcontentService', () => {
  let service: AppcontentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppcontentService],
    }).compile();

    service = module.get<AppcontentService>(AppcontentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
