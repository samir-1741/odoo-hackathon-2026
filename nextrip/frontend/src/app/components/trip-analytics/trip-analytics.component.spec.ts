import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAnalyticsComponent } from './trip-analytics.component';

describe('TripAnalyticsComponent', () => {
  let component: TripAnalyticsComponent;
  let fixture: ComponentFixture<TripAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
