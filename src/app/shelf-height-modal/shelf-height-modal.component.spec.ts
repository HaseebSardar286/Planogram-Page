import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfHeightModalComponent } from './shelf-height-modal.component';

describe('ShelfHeightModalComponent', () => {
  let component: ShelfHeightModalComponent;
  let fixture: ComponentFixture<ShelfHeightModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfHeightModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfHeightModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
