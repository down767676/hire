import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookPostDialogComponent } from './facebook-post-dialog.component';

describe('FacebookPostDialogComponent', () => {
  let component: FacebookPostDialogComponent;
  let fixture: ComponentFixture<FacebookPostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookPostDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
