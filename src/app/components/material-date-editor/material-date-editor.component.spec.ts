import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDateEditorComponent } from './material-date-editor.component';

describe('MaterialDateEditorComponent', () => {
  let component: MaterialDateEditorComponent;
  let fixture: ComponentFixture<MaterialDateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDateEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialDateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
