import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-shelf-height-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './shelf-height-modal.component.html',
  styleUrls: ['./shelf-height-modal.component.css'],
})
export class ShelfHeightModalComponent {
  @Input() shelfHeightInput: number = 300;
  @Input() selectedStatusRackHeight: 'cm' | 'in' = 'cm';
  @Input() applyToAll: boolean = false;
  @Input() index: number = 0;
  @Input() dropdownOpenRackHeight: boolean = false;
  @Output() save = new EventEmitter<{
    height: number;
    unit: 'cm' | 'in';
    applyToAll: boolean;
    index: number;
  }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() toggleDropdown = new EventEmitter<void>();
  @Output() selectUnit = new EventEmitter<'cm' | 'in'>();

  onSave(): void {
    this.save.emit({
      height: this.shelfHeightInput,
      unit: this.selectedStatusRackHeight,
      applyToAll: this.applyToAll,
      index: this.index,
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
