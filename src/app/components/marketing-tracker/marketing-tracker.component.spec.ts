import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingTrackerComponent } from './marketing-tracker.component';

describe('MarketingTrackerComponent', () => {
  let component: MarketingTrackerComponent;
  let fixture: ComponentFixture<MarketingTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingTrackerComponent]
    });
    fixture = TestBed.createComponent(MarketingTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});