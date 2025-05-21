import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-rack-width-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './rack-width-modal.component.html',
  styleUrls: ['./rack-width-modal.component.css'],
})
export class RackWidthModalComponent {
  @Input() rackWidthCm: number = 20;
  @Input() selectedStatusRackWidth: 'cm' | 'in' = 'cm';
  @Input() dropdownOpenRackWidth: boolean = false;
  @Output() save = new EventEmitter<{ width: number; unit: 'cm' | 'in' }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() toggleDropdown = new EventEmitter<void>();
  @Output() selectUnit = new EventEmitter<'cm' | 'in'>();

  onSave(): void {
    this.save.emit({
      width: this.rackWidthCm,
      unit: this.selectedStatusRackWidth,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onToggleDropdown(): void {
    this.toggleDropdown.emit();
  }

  onSelectUnit(unit: 'cm' | 'in'): void {
    this.selectUnit.emit(unit);
  }
}
