import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparencyContent } from './transparency-content';

describe('TransparencyContent', () => {
  let component: TransparencyContent;
  let fixture: ComponentFixture<TransparencyContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransparencyContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransparencyContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
