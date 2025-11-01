import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donations } from './donations';

describe('Donations', () => {
  let component: Donations;
  let fixture: ComponentFixture<Donations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Donations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
