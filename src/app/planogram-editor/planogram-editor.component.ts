import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { PlanogramService } from '../services/planogram.service';
import {
  faSave,
  faArrowLeft,
  faPlus,
  faTrash,
  faCopy,
  faEdit,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Canvas, SKU, Planogram } from '../interfaces/interfaces';
import { RackWidthModalComponent } from '../rack-width-modal/rack-width-modal.component';
import { ShelfHeightModalComponent } from '../shelf-height-modal/shelf-height-modal.component';
import { SKUListModalComponent } from '../sku-list-modal/sku-list-modal.component';
import { NewShelfModalComponent } from '../new-shelf-modal/new-shelf-modal.component';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-planogram-editor',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    RackWidthModalComponent,
    ShelfHeightModalComponent,
    SKUListModalComponent,
    NewShelfModalComponent,
  ],
  templateUrl: './planogram-editor.component.html',
  styleUrls: ['./planogram-editor.component.css'],
})
export class PlanogramEditorComponent implements OnInit, OnDestroy {
  faSave = faSave;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;
  faTrash = faTrash;
  faCopy = faCopy;
  faEdit = faEdit;
  faDownload = faDownload;

  title: string = '';
  rackWidthCm: number = 20;
  rackWidthPx: number = 3780;
  rackHeight: number = 10;
  canvases: Canvas[] = [];
  selectedStatusRackHeight: 'cm' | 'in' = 'cm';
  selectedStatusRackWidth: 'cm' | 'in' = 'cm';
  dropdownOpenRackHeight = false;
  dropdownOpenRackWidth = false;
  shelfHeightInput: number = 10;
  applyToAll: boolean = false;
  planogramId: number | null = null;
  selectedStatus: string = '';
  dropdownOpen = false;
  selectedSKU: string | null = null;
  searchQuery: string = '';
  selectedQuantity: number = 1;

  skus: SKU[] = [
    {
      id: 'sku1',
      name: 'Infant Formula',
      category: 'Nutrition',
      skuId: '52',
      description: 'Premium infant formula for newborns',
      unit: 'cm',
      dimensions: '3 | 2',
      imageUrl: 'images/abc.jpeg',
      quantity: 1,
    },
    {
      id: 'sku2',
      name: 'Product B',
      category: 'Nutrition',
      skuId: '53',
      description: 'High protein nutrition shake',
      unit: 'cm',
      dimensions: '3 | 2',
      imageUrl: 'images/images.jpeg',
      quantity: 1,
    },
    {
      id: 'sku3',
      name: 'Nesfruta Mango',
      category: 'Nesfruta',
      skuId: '54',
      description: 'Mango flavored fruit drink',
      unit: 'in',
      dimensions: '2 | 1',
      imageUrl: 'images/download.jpeg',
      quantity: 1,
    },
    {
      id: 'sku4',
      name: 'Nesfruta Orange',
      category: 'Nesfruta',
      skuId: '55',
      description: 'Orange flavored fruit drink',
      unit: 'in',
      dimensions: '3 | 1',
      imageUrl: 'images/abc.jpeg',
      quantity: 1,
    },
    {
      id: 'sku5',
      name: 'Apple Juice',
      category: 'Juices',
      skuId: '56',
      description: '100% pure apple juice',
      unit: 'in',
      dimensions: '1 | 1',
      imageUrl: 'images/download.jpeg',
      quantity: 1,
    },
    {
      id: 'sku6',
      name: 'Orange Juice',
      category: 'Juices',
      skuId: '57',
      description: 'Fresh squeezed orange juice',
      unit: 'in',
      dimensions: '2 | 1',
      imageUrl: 'images/images.jpeg',
      quantity: 1,
    },
  ];

  constructor(
    private router: Router,
    private planogramService: PlanogramService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const state = history.state as {
      title?: string;
      rackWidth?: number;
      height?: number;
      id?: number;
    };
    this.title = state.title ?? '';
    this.rackWidthCm = state.rackWidth ?? 20;
    this.rackHeight = state.height ?? 300;
    this.planogramId = state.id ?? null;
    this.rackWidthPx = this.convertCmToPx(this.rackWidthCm);

    this.canvases.push({
      id: Date.now(),
      width: this.rackWidthPx,
      height: this.rackHeight,
      topSkus: [],
      rightSkus: [],
    });
  }

  ngOnDestroy(): void {
    document.querySelectorAll('.modal').forEach((modalElement) => {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        this.backdropRemover();
      }
    });
  }

  convertCmToPx(cm: number): number {
    return cm * 37.8;
  }

  convertInToPx(inches: number): number {
    return inches * 96;
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
      modal.show();
      modalElement.removeAttribute('aria-hidden');
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        this.backdropRemover();
      }
    }
  }

  openSKUListModal(
    index: number,
    position: 'top' | 'right' = 'right',
    skuIndex?: number
  ): void {
    this.selectedQuantity = 1;
    this.searchQuery = '';
    this.selectedStatus = 'Filter by category';
    console.log(
      `Opening SKUListModal: canvasIndex=${index}, position=${position}, skuIndex=${skuIndex}`
    );
    this.canvases[index].tempPosition = position;
    this.canvases[index].tempSkuIndex = skuIndex;
    this.openModal(`SKUListModal${index}`);
  }

  selectSKU(skuId: string): void {
    this.selectedSKU = skuId;
  }

  /**
   * Adds a new SKU to the specified canvas in either the top or right container.
   * Checks if adding the SKU would exceed canvas height (for top SKUs) or width (for right SKUs).
   * @param index - The index of the canvas to add the SKU to.
   * @param data - Object containing the SKU ID, quantity, and position ('top' or 'right').
   */
  addSKU(
    index: number,
    data: { skuId: string; quantity: number; position: 'top' | 'right' }
  ): void {
    // Find the SKU definition from the skus array using the provided skuId
    const sku = this.skus.find((s) => s.id === data.skuId);
    if (!sku) {
      // Alert user and exit if SKU is not found
      alert('Selected SKU not found.');
      return;
    }

    // Create a new SKU object by copying the found SKU, updating quantity and initializing positions
    const newSku: SKU = {
      ...sku,
      quantity: data.quantity,
      imageUrl: sku.imageUrl,
      xPosition: 0,
      yPosition: 0,
    };

    // Get dimensions of the new SKU
    const newSkuDims = this.getSKUDimensions(newSku);

    // Recalculate right SKU positions to ensure consistency before adding (affects xPosition calculations)
    this.recalculateRightSkuPositions(index);

    if (data.position === 'top') {
      // Ensure topSkus array is initialized for the canvas
      this.canvases[index].topSkus = this.canvases[index].topSkus || [];
      // Get the index of the clicked SKU from temp storage (set in openSKUListModal)
      const clickedSkuIndex = this.canvases[index].tempSkuIndex;

      // Log the context for debugging
      console.log(
        `Adding top SKU: clickedSkuIndex=${clickedSkuIndex}, tempPosition=${this.canvases[index].tempPosition}`
      );

      // Check if a valid clicked SKU index and position context exist
      if (clickedSkuIndex !== undefined && this.canvases[index].tempPosition) {
        // Initialize position variables
        let xPosition = 0;
        let yPosition = 0;

        if (this.canvases[index].tempPosition === 'right') {
          // Adding a top SKU relative to a right SKU
          const rightSkus = this.canvases[index].rightSkus || [];
          if (clickedSkuIndex >= 0 && clickedSkuIndex < rightSkus.length) {
            // Get the right SKU that was clicked
            const clickedRightSku = rightSkus[clickedSkuIndex];
            // Set xPosition to match the right SKU's xPosition
            xPosition = clickedRightSku.xPosition || 0;
            // Calculate yPosition as the top of the right SKU (height * quantity)
            const rightDims = this.getSKUDimensions(clickedRightSku);
            yPosition = rightDims.height * clickedRightSku.quantity;
            // Log the right SKU details for debugging
            console.log(
              `Right SKU: xPosition=${xPosition}, height=${rightDims.height}, quantity=${clickedRightSku.quantity}, yPosition=${yPosition}`
            );
          } else {
            // Warn and alert if the clicked index is invalid
            console.warn(
              `Invalid clickedSkuIndex=${clickedSkuIndex} for rightSkus.length=${rightSkus.length}`
            );
            alert('Cannot add top SKU: Invalid right SKU selection.');
            return;
          }
        } else if (this.canvases[index].tempPosition === 'top') {
          // Adding a top SKU relative to an existing top SKU or right SKU
          const rightSkus = this.canvases[index].rightSkus || [];
          let rightSkuAtPosition: SKU | undefined;

          if (rightSkus.length > 0) {
            // Try to find a right SKU at the clicked index
            rightSkuAtPosition = rightSkus[clickedSkuIndex];
          }

          if (rightSkuAtPosition) {
            // If a right SKU exists, align the top SKU with it
            xPosition = rightSkuAtPosition.xPosition || 0;
            const rightDims = this.getSKUDimensions(rightSkuAtPosition);
            yPosition = rightDims.height * rightSkuAtPosition.quantity;
            console.log(
              `Right SKU at top position: xPosition=${xPosition}, height=${rightDims.height}, quantity=${rightSkuAtPosition.quantity}, yPosition=${yPosition}`
            );
          } else {
            // If no right SKU, stack on top of existing top SKUs
            const clickedSku = this.canvases[index].topSkus[clickedSkuIndex];
            if (clickedSku) {
              // Use the xPosition of the clicked top SKU
              xPosition = clickedSku.xPosition || 0;
              // Calculate total height of top SKUs at this xPosition
              let totalHeight = 0;
              this.canvases[index].topSkus
                .filter((s) => s.xPosition === xPosition)
                .forEach((s) => {
                  const dims = this.getSKUDimensions(s);
                  totalHeight += dims.height * s.quantity;
                });
              yPosition = totalHeight;
              console.log(
                `Top SKU stack: xPosition=${xPosition}, totalHeight=${totalHeight}, yPosition=${yPosition}`
              );
            } else {
              // Warn and alert if the clicked top SKU index is invalid
              console.warn(
                `Invalid clickedSkuIndex=${clickedSkuIndex} for topSkus.length=${this.canvases[index].topSkus.length}`
              );
              alert('Cannot add top SKU: Invalid top SKU selection.');
              return;
            }
          }
        } else {
          // Warn and alert if the tempPosition is invalid
          console.warn(
            `Invalid tempPosition=${this.canvases[index].tempPosition}`
          );
          alert('Cannot add top SKU: Invalid position context.');
          return;
        }

        // Assign calculated positions to the new SKU
        newSku.xPosition = xPosition;
        newSku.yPosition = yPosition;

        // Check if adding the new top SKU exceeds canvas height
        let totalHeight = 0;
        // Include right SKU height at xPosition, if any
        const rightSku = this.canvases[index].rightSkus.find(
          (s) => s.xPosition === xPosition
        );
        if (rightSku) {
          const rightDims = this.getSKUDimensions(rightSku);
          totalHeight += rightDims.height * rightSku.quantity;
        }
        // Sum heights of existing top SKUs at xPosition
        this.canvases[index].topSkus
          .filter((s) => s.xPosition === xPosition)
          .forEach((s) => {
            const dims = this.getSKUDimensions(s);
            totalHeight += dims.height * s.quantity;
          });
        // Add height of the new SKU
        totalHeight += newSkuDims.height * newSku.quantity;

        // Compare against canvas height
        if (totalHeight > this.canvases[index].height) {
          console.warn(
            `Cannot add top SKU: Total height=${totalHeight}px exceeds canvas height=${this.canvases[index].height}px`
          );
          alert('Cannot add top SKU: Total height would exceed canvas height.');
          return;
        }
      } else {
        // Warn and alert if no valid context is provided
        console.warn(
          `No clicked SKU or tempPosition: clickedSkuIndex=${clickedSkuIndex}, tempPosition=${this.canvases[index].tempPosition}`
        );
        alert('Cannot add top SKU: No SKU selected.');
        return;
      }

      // Log the final position of the new top SKU
      console.log(
        `Adding top SKU at x=${newSku.xPosition}, y=${newSku.yPosition}`
      );
      // Add the new SKU to the beginning of topSkus (stacking order)
      this.canvases[index].topSkus.unshift(newSku);
      // Recalculate top SKU positions to stack them correctly
      this.recalculateTopSkuPositions(index);
    } else {
      // Adding a right SKU
      this.canvases[index].rightSkus = this.canvases[index].rightSkus || [];
      // Calculate xPosition by summing the widths of existing right SKUs
      let xPosition = 0;
      let totalWidth = 0;
      this.canvases[index].rightSkus.forEach((s) => {
        const dims = this.getSKUDimensions(s);
        xPosition += dims.width * s.quantity;
        totalWidth += dims.width * s.quantity;
      });
      // Add width of the new SKU
      totalWidth += newSkuDims.width * newSku.quantity;

      // Check if adding the new right SKU exceeds canvas width
      if (totalWidth > this.canvases[index].width) {
        console.warn(
          `Cannot add right SKU: Total width=${totalWidth}px exceeds canvas width=${this.canvases[index].width}px`
        );
        alert('Cannot add right SKU: Total width would exceed canvas width.');
        return;
      }

      // Assign the calculated xPosition to the new SKU
      newSku.xPosition = xPosition;
      // Append the new SKU to rightSkus
      this.canvases[index].rightSkus.push(newSku);
      // Recalculate right SKU positions to ensure consistency
      this.recalculateRightSkuPositions(index);
    }

    // Close the SKU selection modal
    this.closeModal(`SKUListModal${index}`);
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  /**
   * Removes an SKU from the specified canvas and recalculates positions.
   * @param canvasIndex - The index of the canvas containing the SKU.
   * @param skuIndex - The index of the SKU to remove within its container.
   * @param container - The container type ('top' or 'right') from which to remove the SKU.
   */
  removeSKU(
    canvasIndex: number, // Index of the canvas
    skuIndex: number, // Index of the SKU to remove
    container: 'top' | 'right' // Target container
  ): void {
    // Log right SKU positions before deletion for debugging
    console.log(
      `Before deletion: rightSkus positions=`,
      this.canvases[canvasIndex].rightSkus.map((s) => `x=${s.xPosition}`)
    );

    // Log top SKU positions before deletion for debugging
    console.log(
      `Before deletion: topSkus positions=`,
      this.canvases[canvasIndex].topSkus.map(
        (s) => `x=${s.xPosition}, y=${s.yPosition}`
      )
    );

    if (container === 'top') {
      // Remove the specified top SKU from the topSkus array
      this.canvases[canvasIndex].topSkus.splice(skuIndex, 1);
      // Recalculate top SKU positions to shift remaining SKUs downward
      this.recalculateTopSkuPositions(canvasIndex);
    } else {
      // Remove the specified right SKU from the rightSkus array
      this.canvases[canvasIndex].rightSkus.splice(skuIndex, 1);
      // Recalculate right SKU positions to shift remaining SKUs leftward
      this.recalculateRightSkuPositions(canvasIndex);
    }

    // Log right SKU positions after deletion to verify shifts
    console.log(
      `After deletion: rightSkus positions=`,
      this.canvases[canvasIndex].rightSkus.map((s) => `x=${s.xPosition}`)
    );

    // Log top SKU positions after deletion to verify updates
    console.log(
      `After deletion: topSkus positions=`,
      this.canvases[canvasIndex].topSkus.map(
        (s) => `x=${s.xPosition}, y=${s.yPosition}`
      )
    );

    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  /**
   * Recalculates yPositions for top SKUs to stack them vertically after changes.
   * Groups top SKUs by xPosition and stacks them above the corresponding right SKU.
   * @param canvasIndex - The index of the canvas to recalculate top SKU positions for.
   */
  private recalculateTopSkuPositions(canvasIndex: number): void {
    // Ensure topSkus array is initialized
    this.canvases[canvasIndex].topSkus =
      this.canvases[canvasIndex].topSkus || [];

    // Group top SKUs by their xPosition for vertical stacking
    const xPositionGroups = new Map<number, SKU[]>();
    this.canvases[canvasIndex].topSkus.forEach((sku) => {
      // Use 0 as default xPosition if undefined
      const xPos = sku.xPosition || 0;
      if (!xPositionGroups.has(xPos)) {
        xPositionGroups.set(xPos, []);
      }
      xPositionGroups.get(xPos)!.push(sku);
    });

    // Process each xPosition group to stack top SKUs
    xPositionGroups.forEach((skus, xPos) => {
      // Sort SKUs by yPosition (ascending) to maintain stacking order
      skus.sort((a, b) => (a.yPosition || 0) - (b.yPosition || 0));

      // Initialize stacking height, starting at 0 or the top of the right SKU
      let totalHeight = 0;
      // Find the right SKU at this xPosition, if any
      const rightSku = this.canvases[canvasIndex].rightSkus.find(
        (s) => s.xPosition === xPos
      );
      if (rightSku) {
        // If a right SKU exists, start stacking above its total height
        const rightDims = this.getSKUDimensions(rightSku);
        totalHeight = rightDims.height * rightSku.quantity;
      }

      // Assign new yPositions to top SKUs, stacking them vertically
      skus.forEach((sku) => {
        sku.yPosition = totalHeight;
        // Add the SKU's height (height * quantity) to the stack
        const dims = this.getSKUDimensions(sku);
        totalHeight += dims.height * sku.quantity;
      });
    });
  }

  /**
   * Recalculates xPositions for right SKUs to align them horizontally.
   * Called after adding or removing a right SKU to shift positions leftward.
   * @param canvasIndex - The index of the canvas to recalculate right SKU positions for.
   */
  private recalculateRightSkuPositions(canvasIndex: number): void {
    // Ensure rightSkus array is initialized
    this.canvases[canvasIndex].rightSkus =
      this.canvases[canvasIndex].rightSkus || [];
    // Start positioning at x=0
    let xPosition = 0;
    // Iterate through right SKUs to assign new xPositions
    this.canvases[canvasIndex].rightSkus.forEach((sku) => {
      // Assign the current xPosition to the SKU
      sku.xPosition = xPosition;
      // Calculate the SKU's width (width * quantity)
      const dims = this.getSKUDimensions(sku);
      // Increment xPosition by the SKU's total width
      xPosition += dims.width * sku.quantity;
    });
  }

  openShelfHeightModal(index: number): void {
    this.shelfHeightInput = this.canvases[index].height / 37.8;
    this.selectedStatusRackHeight = 'cm';
    this.applyToAll = false;
    this.openModal(`shelfHeightModal${index}`);
  }

  saveShelfHeight(data: {
    height: number;
    unit: 'cm' | 'in';
    applyToAll: boolean;
    index: number;
  }): void {
    const heightInPx =
      data.unit === 'in'
        ? this.convertInToPx(data.height)
        : this.convertCmToPx(data.height);

    if (data.applyToAll) {
      this.canvases.forEach((canvas) => {
        canvas.height = heightInPx;
      });
      this.rackHeight = heightInPx;
    } else {
      this.canvases[data.index].height = heightInPx;
    }

    this.closeModal(`shelfHeightModal${data.index}`);
    this.cdr.detectChanges();
  }

  saveRackWidth(data: { width: number; unit: 'cm' | 'in' }): void {
    const widthInPx =
      data.unit === 'in'
        ? this.convertInToPx(data.width)
        : this.convertCmToPx(data.width);
    this.rackWidthPx = widthInPx;
    this.canvases.forEach((canvas) => {
      canvas.width = widthInPx;
    });

    this.closeModal('rackWidthModal');
    this.cdr.detectChanges();
  }

  backdropRemover(): void {
    document
      .querySelectorAll('.modal-backdrop')
      .forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '';
    document.querySelectorAll('.modal.show').forEach((modal) => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  duplicateCanvas(index: number): void {
    const canvas = this.canvases[index];
    const clone: Canvas = {
      id: Date.now(),
      width: canvas.width,
      height: canvas.height,
      topSkus: canvas.topSkus ? [...canvas.topSkus] : [],
      rightSkus: canvas.rightSkus ? [...canvas.rightSkus] : [],
    };
    this.canvases.splice(index + 1, 0, clone);
    this.cdr.detectChanges();
  }

  deleteCanvas(index: number): void {
    if (this.canvases.length > 0) {
      this.canvases.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  addCanvas(position: 'above' | 'below', index: number): void {
    const newCanvas: Canvas = {
      id: Date.now(),
      width: this.rackWidthPx,
      height: this.rackHeight,
      topSkus: [],
      rightSkus: [],
    };
    if (position === 'above') {
      this.canvases.splice(index, 0, newCanvas);
    } else {
      this.canvases.splice(index + 1, 0, newCanvas);
    }
    this.cdr.detectChanges();
  }

  savePlanogram(): void {
    const planogram: Planogram = {
      id: this.planogramId ?? Date.now(),
      title: this.title,
      height: this.rackHeight,
      width: this.rackWidthCm,
      canvases: this.canvases,
    };

    if (this.planogramId) {
      this.planogramService.updatePlanogram(this.planogramId, planogram);
    } else {
      this.planogramService.addPlanogram(planogram);
    }
  }

  openNewShelfModal(): void {
    this.shelfHeightInput = 300;
    this.selectedStatusRackHeight = 'cm';
    this.openModal('newShelfModal');
  }

  addNewCanvasWithHeight(data: { height: number; unit: 'cm' | 'in' }): void {
    const heightInPx =
      data.unit === 'in'
        ? this.convertInToPx(data.height)
        : this.convertCmToPx(data.height);

    const newCanvas: Canvas = {
      id: Date.now(),
      width: this.rackWidthPx,
      height: heightInPx,
      topSkus: [],
      rightSkus: [],
    };
    this.canvases.push(newCanvas);
    this.rackHeight = heightInPx;

    this.closeModal('newShelfModal');
    this.cdr.detectChanges();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.dropdownOpen = false;
  }

  toggleDropDown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectStatusRackHeight(status: 'cm' | 'in'): void {
    this.selectedStatusRackHeight = status;
    this.dropdownOpenRackHeight = false;
  }

  selectStatusRackWidth(status: 'cm' | 'in'): void {
    this.selectedStatusRackWidth = status;
    this.dropdownOpenRackWidth = false;
  }

  toggleDropDownRackHeight(): void {
    this.dropdownOpenRackHeight = !this.dropdownOpenRackHeight;
  }

  toggleDropDownRackWidth(): void {
    this.dropdownOpenRackWidth = !this.dropdownOpenRackWidth;
  }

  goBackToPlanogram(): void {
    this.router.navigate(['']);
  }

  getSKUDimensions(sku: SKU): { width: number; height: number } {
    const [heightStr, widthStr] = sku.dimensions
      .split('|')
      .map((s) => s.trim());
    const height = parseFloat(heightStr);
    const width = parseFloat(widthStr);
    if (isNaN(height) || isNaN(width) || height <= 0 || width <= 0) {
      console.warn(`Invalid dimensions for SKU ${sku.name}: ${sku.dimensions}`);
      return { width: 100, height: 100 };
    }
    return {
      width:
        sku.unit === 'cm'
          ? this.convertCmToPx(width)
          : this.convertInToPx(width),
      height:
        sku.unit === 'cm'
          ? this.convertCmToPx(height)
          : this.convertInToPx(height),
    };
  }

  async downloadPlanogram(): Promise<void> {
    const canvasContainers = document.querySelectorAll('.canvas-container');
    if (canvasContainers.length === 0) {
      alert('No planogram shelves to download.');
      return;
    }

    // Add downloading class to hide interactive elements
    canvasContainers.forEach((container) =>
      container.classList.add('downloading')
    );

    try {
      // Calculate total dimensions
      let totalHeight = 0;
      let maxWidth = 0;
      const canvases: HTMLCanvasElement[] = [];

      // Capture each canvas-container as a canvas
      for (const container of Array.from(canvasContainers)) {
        const canvas = await html2canvas(container as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        totalHeight += canvas.height;
        maxWidth = Math.max(maxWidth, canvas.width);
        canvases.push(canvas);
      }

      // Create a single canvas to combine all shelves
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = maxWidth;
      combinedCanvas.height = totalHeight;
      const ctx = combinedCanvas.getContext('2d');

      if (!ctx) {
        alert('Failed to create canvas context.');
        return;
      }

      // Draw each canvas onto the combined canvas
      let currentY = 0;
      for (const canvas of canvases) {
        ctx.drawImage(canvas, 0, currentY);
        currentY += canvas.height;
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `planogram-${this.title || 'untitled'}-${Date.now()}.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();
    } finally {
      // Remove downloading class
      canvasContainers.forEach((container) =>
        container.classList.remove('downloading')
      );
    }
  }
}
