import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTabComponent } from './candidate-tab.component';

describe('CandidateTabComponent', () => {
  let component: CandidateTabComponent;
  let fixture: ComponentFixture<CandidateTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
