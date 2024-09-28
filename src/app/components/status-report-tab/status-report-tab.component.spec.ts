import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusReportTabComponent } from './status-report-tab.component';

describe('StatusReportTabComponent', () => {
  let component: StatusReportTabComponent;
  let fixture: ComponentFixture<StatusReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusReportTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
