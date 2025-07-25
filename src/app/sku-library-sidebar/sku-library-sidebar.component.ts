import { Component, Input } from '@angular/core';
import { SkusDragDropComponent } from '../cards/skus-drag-drop/skus-drag-drop.component';
import { SKU } from '../interfaces/interfaces';

@Component({
  selector: 'app-sku-library-sidebar',
  standalone: true,
  imports: [SkusDragDropComponent],
  templateUrl: './sku-library-sidebar.component.html',
  styleUrl: './sku-library-sidebar.component.css',
})
export class SkuLibrarySidebarComponent {
  @Input() skus: SKU[] = [];
}
