import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultsTabComponent } from './defaults-tab.component';

describe('DefaultsTabComponent', () => {
  let component: DefaultsTabComponent;
  let fixture: ComponentFixture<DefaultsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
