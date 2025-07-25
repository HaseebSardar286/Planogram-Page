import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { SKU } from '../../interfaces/interfaces';

@Component({
  selector: 'app-skus-drag-drop',
  standalone: true,
  imports: [NgFor],
  templateUrl: './skus-drag-drop.component.html',
  styleUrl: './skus-drag-drop.component.css',
})
export class SkusDragDropComponent {
  @Input() skus: SKU[] = [];

  onDragStart(event: DragEvent, sku: SKU) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(sku));
      event.dataTransfer.effectAllowed = 'move';
    }
  }
}
