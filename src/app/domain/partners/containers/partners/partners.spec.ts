import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Partners } from './partners';

describe('Partners', () => {
  let component: Partners;
  let fixture: ComponentFixture<Partners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Partners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Partners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
