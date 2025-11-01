import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerForm } from './partner-form';

describe('PartnerForm', () => {
  let component: PartnerForm;
  let fixture: ComponentFixture<PartnerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
