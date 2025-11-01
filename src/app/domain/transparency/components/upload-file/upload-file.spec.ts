import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFile } from './upload-file';

describe('UploadFile', () => {
  let component: UploadFile;
  let fixture: ComponentFixture<UploadFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
