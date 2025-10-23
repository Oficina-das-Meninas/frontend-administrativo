import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CKEditorComponent } from './ck-editor';

describe('CKEditorComponent', () => {
  let component: CKEditorComponent;
  let fixture: ComponentFixture<CKEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CKEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CKEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
