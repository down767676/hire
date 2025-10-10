import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloTestCellComponent } from './hello-test-cell.component';

describe('HelloTestCellComponent', () => {
  let component: HelloTestCellComponent;
  let fixture: ComponentFixture<HelloTestCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloTestCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelloTestCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
