import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEmailMessageDialogComponent } from './app-email-message-dialog.component';

describe('AppEmailMessageDialogComponent', () => {
  let component: AppEmailMessageDialogComponent;
  let fixture: ComponentFixture<AppEmailMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEmailMessageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEmailMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
