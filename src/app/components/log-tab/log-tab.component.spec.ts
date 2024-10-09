import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogTabComponent } from './log-tab.component';

describe('LogTabComponent', () => {
  let component: LogTabComponent;
  let fixture: ComponentFixture<LogTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
