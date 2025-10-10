import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloWorldCellComponent } from './hello-world-cell.component';

describe('HelloWorldCellComponent', () => {
  let component: HelloWorldCellComponent;
  let fixture: ComponentFixture<HelloWorldCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloWorldCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelloWorldCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
