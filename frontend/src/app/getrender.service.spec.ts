import { TestBed } from '@angular/core/testing';

import { GetrenderService } from './getrender.service';

describe('GetrenderService', () => {
  let service: GetrenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetrenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
