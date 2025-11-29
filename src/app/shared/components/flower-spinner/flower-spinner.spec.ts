import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerSpinner } from './flower-spinner';

describe('FlowerSpinner', () => {
  let component: FlowerSpinner;
  let fixture: ComponentFixture<FlowerSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowerSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowerSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
