import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfileImage } from './upload-profile-image';

describe('UploadProfileImage', () => {
  let component: UploadProfileImage;
  let fixture: ComponentFixture<UploadProfileImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProfileImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProfileImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
