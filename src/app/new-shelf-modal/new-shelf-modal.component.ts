import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-new-shelf-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './new-shelf-modal.component.html',
  styleUrls: ['./new-shelf-modal.component.css'],
})
export class NewShelfModalComponent {
  @Input() shelfHeightInput: number = 300;
  @Input() selectedStatusRackHeight: 'cm' | 'in' = 'cm';
  @Input() dropdownOpenRackHeight: boolean = false;
  @Output() save = new EventEmitter<{ height: number; unit: 'cm' | 'in' }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() toggleDropdown = new EventEmitter<void>();
  @Output() selectUnit = new EventEmitter<'cm' | 'in'>();

  onSave(): void {
    this.save.emit({
      height: this.shelfHeightInput,
      unit: this.selectedStatusRackHeight,
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
