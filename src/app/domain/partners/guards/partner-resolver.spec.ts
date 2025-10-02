import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { partnerResolver } from './partner-resolver';

describe('partnerResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => partnerResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
