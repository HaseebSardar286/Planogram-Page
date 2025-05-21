import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanogramEditorComponent } from './planogram-editor.component';

describe('PlanogramEditorComponent', () => {
  let component: PlanogramEditorComponent;
  let fixture: ComponentFixture<PlanogramEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanogramEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanogramEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
