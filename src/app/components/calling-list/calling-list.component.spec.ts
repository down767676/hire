import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallingListComponent } from './calling-list.component';

describe('CallingListComponent', () => {
  let component: CallingListComponent;
  let fixture: ComponentFixture<CallingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
