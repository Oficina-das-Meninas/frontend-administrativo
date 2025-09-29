import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparencyAccordionComponent } from './transparency-accordion.component';

describe('TransparencyAccordionComponent', () => {
  let component: TransparencyAccordionComponent;
  let fixture: ComponentFixture<TransparencyAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransparencyAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransparencyAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
