import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageReadyComponent } from './package-ready.component';

describe('PackageReadyComponent', () => {
  let component: PackageReadyComponent;
  let fixture: ComponentFixture<PackageReadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageReadyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
