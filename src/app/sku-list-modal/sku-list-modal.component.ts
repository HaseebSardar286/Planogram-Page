import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SKU } from '../interfaces/interfaces';

@Component({
  selector: 'app-sku-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './sku-list-modal.component.html',
  styleUrls: ['./sku-list-modal.component.css'],
})
export class SKUListModalComponent {
  @Input() skus: SKU[] = [];
  @Input() selectedSKU: string | null = null;
  @Input() selectedQuantity: number = 1;
  @Input() searchQuery: string = '';
  @Input() selectedStatus: string = 'Filter by category';
  @Input() dropdownOpen: boolean = false;
  @Input() index: number = 0;
  @Input() position: 'top' | 'right' = 'right'; // Added position input
  @Output() selectSKU = new EventEmitter<string>();
  @Output() addSKU = new EventEmitter<{
    skuId: string;
    quantity: number;
    position: 'top' | 'right';
  }>(); // Updated to include position
  @Output() cancel = new EventEmitter<void>();
  @Output() toggleDropdown = new EventEmitter<void>();
  @Output() selectStatus = new EventEmitter<string>();

  getFilteredSKUs(): SKU[] {
    return this.skus.filter(
      (sku) =>
        (this.selectedStatus === 'Filter by category' ||
          sku.category === this.selectedStatus) &&
        (!this.searchQuery ||
          sku.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          sku.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()))
    );
  }

  onSelectSKU(skuId: string): void {
    this.selectSKU.emit(skuId);
  }

  onAddSKU(): void {
    if (this.selectedSKU) {
      this.addSKU.emit({
        skuId: this.selectedSKU,
        quantity: this.selectedQuantity,
        position: this.position, // Include position in the emitted event
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onToggleDropdown(): void {
    this.toggleDropdown.emit();
  }

  onSelectStatus(status: string): void {
    this.selectStatus.emit(status);
  }
}
