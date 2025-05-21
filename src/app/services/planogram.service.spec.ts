import { TestBed } from '@angular/core/testing';

import { PlanogramService } from './planogram.service';

describe('PlanogramService', () => {
  let service: PlanogramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanogramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
