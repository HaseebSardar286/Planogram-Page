import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkusDragDropComponent } from './skus-drag-drop.component';

describe('SkusDragDropComponent', () => {
  let component: SkusDragDropComponent;
  let fixture: ComponentFixture<SkusDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkusDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkusDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
