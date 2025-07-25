import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuLibrarySidebarComponent } from './sku-library-sidebar.component';

describe('SkuLibrarySidebarComponent', () => {
  let component: SkuLibrarySidebarComponent;
  let fixture: ComponentFixture<SkuLibrarySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkuLibrarySidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuLibrarySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
