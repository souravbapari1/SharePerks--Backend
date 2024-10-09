import { Test, TestingModule } from '@nestjs/testing';
import { AdmitadService } from './admitad.service';

describe('AdmitadService', () => {
  let service: AdmitadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdmitadService],
    }).compile();

    service = module.get<AdmitadService>(AdmitadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
