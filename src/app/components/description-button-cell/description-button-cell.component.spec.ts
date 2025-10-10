import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionButtonCellComponent } from './description-button-cell.component';

describe('DescriptionButtonCellComponent', () => {
  let component: DescriptionButtonCellComponent;
  let fixture: ComponentFixture<DescriptionButtonCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionButtonCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionButtonCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
