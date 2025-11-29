import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredDialog } from './session-expired-dialog';

describe('SessionExpiredDialog', () => {
  let component: SessionExpiredDialog;
  let fixture: ComponentFixture<SessionExpiredDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiredDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionExpiredDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
