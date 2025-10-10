import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarFilterComponentComponent } from './calendar-filter';

describe('CalendarFilterComponentComponent', () => {
  let component: CalendarFilterComponentComponent;
  let fixture: ComponentFixture<CalendarFilterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarFilterComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarFilterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
