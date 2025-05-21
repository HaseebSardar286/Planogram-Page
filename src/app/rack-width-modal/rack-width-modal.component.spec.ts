import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackWidthModalComponent } from './rack-width-modal.component';

describe('RackWidthModalComponent', () => {
  let component: RackWidthModalComponent;
  let fixture: ComponentFixture<RackWidthModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RackWidthModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RackWidthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
