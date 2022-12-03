import { TestBed } from '@angular/core/testing';

import { IsiteService } from './isite.service';

describe('IsiteService', () => {
  let service: IsiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
