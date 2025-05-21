import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShelfModalComponent } from './new-shelf-modal.component';

describe('NewShelfModalComponent', () => {
  let component: NewShelfModalComponent;
  let fixture: ComponentFixture<NewShelfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewShelfModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewShelfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
