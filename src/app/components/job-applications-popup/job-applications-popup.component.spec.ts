import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationsPopupComponent } from './job-applications-popup.component';

describe('JobApplicationsPopupComponent', () => {
  let component: JobApplicationsPopupComponent;
  let fixture: ComponentFixture<JobApplicationsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicationsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
