import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuListModalComponent } from './sku-list-modal.component';

describe('SkuListModalComponent', () => {
  let component: SkuListModalComponent;
  let fixture: ComponentFixture<SkuListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkuListModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
