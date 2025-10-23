import { TestBed } from '@angular/core/testing';

import { TransparencyService } from './transparency.service';

describe('TransparencyService', () => {
  let service: TransparencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransparencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
