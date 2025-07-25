import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { SkuLibrarySidebarComponent } from '../sku-library-sidebar/sku-library-sidebar.component';
import { ShelfHeightModalComponent } from '../shelf-height-modal/shelf-height-modal.component';
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
    SkuLibrarySidebarComponent,
    ShelfHeightModalComponent,
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
  rackWidthCm: number = 40;
  rackWidthPx: number = 0;
  rackHeight: number = 0;
  canvases: Canvas[] = [];
  selectedStatusRackHeight: 'cm' | 'in' = 'cm';
  selectedStatusRackWidth: 'cm' | 'in' = 'cm';
  dropdownOpenRackHeight = false;
  dropdownOpenRackWidth = false;
  shelfHeightInput: number = 10;
  applyToAll: boolean = false;
  planogramId: number | null = null;
  selectedStatus: string = '';
  dropdownOpen: boolean = false;
  selectedSKU: string | null = null;
  searchQuery: string = '';
  selectedQuantity: number = 1;
  scaleFactor: number = 1; // Pixels per cm, reduced by 5x

  skus: SKU[] = [
    {
      id: 'sku1',
      name: 'Infant Formula',
      category: 'Nutrition',
      skuId: '52',
      description: 'Premium infant formula for newborns',
      unit: 'cm',
      dimensions: '4.5 | 11.8',
      imageUrl: 'images/mango.jpg',
      quantity: 1,
    },
    {
      id: 'sku2',
      name: 'Product B',
      category: 'Nutrition',
      skuId: '53',
      description: 'High protein nutrition shake',
      unit: 'cm',
      dimensions: '6 | 21',
      imageUrl: 'images/mango.jpg',
      quantity: 1,
    },
    {
      id: 'sku3',
      name: 'Nesfruta Mango',
      category: 'Nesfruta',
      skuId: '54',
      description: 'Mango flavored fruit drink',
      unit: 'cm',
      dimensions: '4.5 | 11.8',
      imageUrl: 'images/mango.jpg',
      quantity: 1,
    },
    {
      id: 'sku4',
      name: 'Nesfruta Orange',
      category: 'Nesfruta',
      skuId: '55',
      description: 'Orange flavored fruit drink',
      unit: 'cm',
      dimensions: '4.5 | 11.8',
      imageUrl: 'images/mango.jpg',
      quantity: 1,
    },
    {
      id: 'sku5',
      name: 'Apple Juice',
      category: 'Juices',
      skuId: '56',
      description: '100% pure apple juice',
      unit: 'cm',
      dimensions: '4.5 | 11.8',
      imageUrl: 'images/mango.jpg',
      quantity: 1,
    },
    {
      id: 'sku6',
      name: 'Orange Juice',
      category: 'Juices',
      skuId: '57',
      description: 'Fresh squeezed orange juice',
      unit: 'cm',
      dimensions: '4.5 | 11.8',
      imageUrl: 'images/mango.jpg',
      quantity: 1,
    },
  ];

  constructor(
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
    this.rackWidthCm = state.rackWidth ?? 50;
    this.shelfHeightInput = state.height ?? 500;
    this.rackHeight = this.convertCmToPx(this.shelfHeightInput);
    this.planogramId = state.id ?? null;

    this.updateScaleFactor();
    this.rackWidthPx = this.convertCmToPx(this.rackWidthCm);

    this.canvases.push({
      id: Date.now(),
      width: this.rackWidthPx,
      height: this.rackHeight,
      topSkus: [],
      rightSkus: [],
    });

    window.addEventListener('resize', () => {
      this.updateScaleFactor();
      this.updateCanvasDimensions();
      this.cdr.detectChanges();
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
    window.removeEventListener('resize', () => {});
  }

  private updateScaleFactor(): void {
    const maxCanvasWidth = window.innerWidth * 1;
    this.scaleFactor = Math.max(10, maxCanvasWidth / this.rackWidthCm / 5); // Prevent overly large scaleFactor
    console.log(`Scale factor updated: ${this.scaleFactor} px/cm`);
  }

  private updateCanvasDimensions(): void {
    this.rackWidthPx = this.convertCmToPx(this.rackWidthCm);
    this.rackHeight = this.convertCmToPx(this.shelfHeightInput);
    this.canvases.forEach((canvas, index) => {
      canvas.width = this.rackWidthPx;
      canvas.height = this.rackHeight;
      this.recalculateRightSkuPositions(index);
      const affectedXPositions = [
        ...new Set(canvas.topSkus.map((s) => s.xPosition ?? 0)),
      ];
      affectedXPositions.forEach((xPos) =>
        this.recalculateTopSkuPositions(index, xPos)
      );
    });
    console.log(
      `Canvas dimensions updated: width=${this.rackWidthPx}px, height=${this.rackHeight}px`
    );
  }

  convertCmToPx(cm: number): number {
    return cm * this.scaleFactor;
  }

  convertInToPx(inches: number): number {
    return inches * 2.54 * this.scaleFactor;
  }

  onDragOver(event: DragEvent, canvasIndex: number) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, canvasIndex: number) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');
    if (!data) {
      console.warn('No SKU data found in drag event');
      return;
    }

    let sku: SKU;
    try {
      sku = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing SKU data:', error);
      return;
    }

    const canvas = this.canvases[canvasIndex];
    if (!canvas) {
      console.warn(`Invalid canvas index: ${canvasIndex}`);
      return;
    }

    const canvasElement = event.currentTarget as HTMLElement;
    const canvasRect = canvasElement.getBoundingClientRect();
    const dropX = event.clientX - canvasRect.left;
    const dropY = event.clientY - canvasRect.top;
    console.log(`Drop: dropX=${dropX}, dropY=${dropY}`);

    const newSku: SKU = {
      ...sku,
      quantity: this.selectedQuantity, // Use selectedQuantity from sidebar
      xPosition: 0,
      yPosition: 0,
    };

    const newSkuDims = this.getSKUDimensions(newSku);
    const tolerance = 20;

    let baseXPosition: number | null = null;
    let baseYPosition = 0;
    const rightSkus = canvas.rightSkus || [];

    for (const rightSku of rightSkus) {
      const dims = this.getSKUDimensions(rightSku);
      const rightX = rightSku.xPosition ?? 0;
      if (
        dropX >= rightX - tolerance &&
        dropX <= rightX + dims.width + tolerance
      ) {
        baseXPosition = rightX;
        baseYPosition = dims.height * (rightSku.quantity ?? 1);
        break;
      }
    }

    if (baseXPosition === null) {
      const topSkus = canvas.topSkus || [];
      for (const topSku of topSkus) {
        const dims = this.getSKUDimensions(topSku);
        const topX = topSku.xPosition ?? 0;
        if (
          dropX >= topX - tolerance &&
          dropX <= topX + dims.width + tolerance
        ) {
          baseXPosition = topX;
          break;
        }
      }
    }

    if (baseXPosition !== null && dropY >= baseYPosition - tolerance) {
      let stackingHeight = 0;
      const stackedTopSkus = canvas.topSkus.filter(
        (s) => (s.xPosition ?? 0) === baseXPosition
      );
      for (const s of stackedTopSkus) {
        const dims = this.getSKUDimensions(s);
        stackingHeight += dims.height * (s.quantity ?? 1);
      }

      newSku.xPosition = baseXPosition;
      newSku.yPosition = baseYPosition + stackingHeight;

      if (
        newSku.yPosition + newSkuDims.height * newSku.quantity >
        canvas.height
      ) {
        console.warn(
          `Cannot add top SKU: Total height=${
            newSku.yPosition + newSkuDims.height * newSku.quantity
          }px exceeds canvas height=${canvas.height}px`
        );
        alert('Cannot add top SKU: Total height would exceed canvas height.');
        return;
      }

      console.log(
        `Adding top SKU at x=${newSku.xPosition}, y=${newSku.yPosition}, quantity=${newSku.quantity}`
      );
      canvas.topSkus.push(newSku);
      this.recalculateTopSkuPositions(canvasIndex, baseXPosition);
    } else {
      let xPosition = 0;
      let minDistance = Infinity;
      let closestXPosition: number | null = null;

      for (const rightSku of rightSkus) {
        const dims = this.getSKUDimensions(rightSku);
        const rightX = rightSku.xPosition ?? 0;
        const distance = Math.abs(dropX - rightX);
        if (distance < minDistance && distance <= tolerance) {
          minDistance = distance;
          closestXPosition = rightX;
        }
      }

      if (closestXPosition !== null) {
        xPosition = closestXPosition;
      } else {
        for (const s of rightSkus) {
          const dims = this.getSKUDimensions(s);
          xPosition = Math.max(
            xPosition,
            (s.xPosition ?? 0) + dims.width * (s.quantity ?? 1)
          );
        }
      }

      newSku.xPosition = xPosition;
      newSku.yPosition = 0;

      for (const rightSku of rightSkus) {
        if (rightSku === newSku) continue;
        const dims = this.getSKUDimensions(rightSku);
        const rightX = rightSku.xPosition ?? 0;
        if (
          xPosition < rightX + dims.width * (rightSku.quantity ?? 1) &&
          xPosition + newSkuDims.width * newSku.quantity > rightX
        ) {
          xPosition = rightX + dims.width * (rightSku.quantity ?? 1);
          newSku.xPosition = xPosition;
        }
      }

      if (xPosition + newSkuDims.width * newSku.quantity > canvas.width) {
        console.warn(
          `Cannot add right SKU: Total width=${
            xPosition + newSkuDims.width * newSku.quantity
          }px exceeds canvas width=${canvas.width}px`
        );
        alert('Cannot add right SKU: Position would exceed canvas width.');
        return;
      }

      console.log(
        `Adding right SKU at x=${newSku.xPosition}, y=${newSku.yPosition}, quantity=${newSku.quantity}`
      );
      canvas.rightSkus.push(newSku);
      this.recalculateRightSkuPositions(canvasIndex);
    }

    this.cdr.detectChanges();
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
    } else {
      console.error(`Modal element with ID ${modalId} not found`);
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

  removeSKU(
    canvasIndex: number,
    skuIndex: number,
    container: 'top' | 'right'
  ): void {
    console.log(
      `Removing SKU: canvasIndex=${canvasIndex}, skuIndex=${skuIndex}, container=${container}`
    );
    console.log(
      `Before deletion: rightSkus positions=`,
      this.canvases[canvasIndex].rightSkus.map((s) => `x=${s.xPosition}`)
    );
    console.log(
      `Before deletion: topSkus positions=`,
      this.canvases[canvasIndex].topSkus.map(
        (s) => `x=${s.xPosition}, y=${s.yPosition}`
      )
    );

    if (container === 'top') {
      if (
        skuIndex >= 0 &&
        skuIndex < this.canvases[canvasIndex].topSkus.length
      ) {
        const deletedSku = this.canvases[canvasIndex].topSkus[skuIndex];
        const xPosition = deletedSku.xPosition ?? 0;
        this.canvases[canvasIndex].topSkus.splice(skuIndex, 1);
        this.recalculateTopSkuPositions(canvasIndex, xPosition);
      } else {
        console.error(
          `Invalid skuIndex=${skuIndex} for topSkus.length=${this.canvases[canvasIndex].topSkus.length}`
        );
        alert('Cannot remove top SKU: Invalid index.');
      }
    } else {
      if (
        skuIndex >= 0 &&
        skuIndex < this.canvases[canvasIndex].rightSkus.length
      ) {
        const deletedSku = this.canvases[canvasIndex].rightSkus[skuIndex];
        const xPosition = deletedSku.xPosition ?? 0;
        this.canvases[canvasIndex].rightSkus.splice(skuIndex, 1);
        this.recalculateRightSkuPositions(canvasIndex);
        this.recalculateTopSkuPositions(canvasIndex, xPosition);
      } else {
        console.error(
          `Invalid skuIndex=${skuIndex} for rightSkus.length=${this.canvases[canvasIndex].rightSkus.length}`
        );
        alert('Cannot remove right SKU: Invalid index.');
      }
    }

    console.log(
      `After deletion: rightSkus positions=`,
      this.canvases[canvasIndex].rightSkus.map((s) => `x=${s.xPosition}`)
    );
    console.log(
      `After deletion: topSkus positions=`,
      this.canvases[canvasIndex].topSkus.map(
        (s) => `x=${s.xPosition}, y=${s.yPosition}`
      )
    );

    this.cdr.detectChanges();
  }

  private recalculateTopSkuPositions(
    canvasIndex: number,
    affectedXPosition: number
  ): void {
    const canvas = this.canvases[canvasIndex];
    canvas.topSkus = canvas.topSkus || [];

    const affectedSkus = canvas.topSkus
      .filter((sku) => (sku.xPosition ?? 0) === affectedXPosition)
      .sort((a, b) => (a.yPosition ?? 0) - (b.yPosition ?? 0));
    const unaffectedSkus = canvas.topSkus.filter(
      (sku) => (sku.xPosition ?? 0) !== affectedXPosition
    );

    let totalHeight = 0;
    const rightSku = canvas.rightSkus.find(
      (s) => (s.xPosition ?? 0) === affectedXPosition
    );
    if (rightSku) {
      const rightDims = this.getSKUDimensions(rightSku);
      totalHeight = rightDims.height * (rightSku.quantity ?? 1);
    } else {
      totalHeight = 0; // Reset to 0 if no right SKU exists
    }

    for (const sku of affectedSkus) {
      const dims = this.getSKUDimensions(sku);
      const skuHeight = dims.height * (sku.quantity ?? 1);
      if (totalHeight + skuHeight > canvas.height) {
        console.warn(
          `Cannot keep SKU at x=${affectedXPosition}: Total height=${
            totalHeight + skuHeight
          }px exceeds canvas height=${canvas.height}px`
        );
        let newXPos = affectedXPosition + dims.width;
        while (
          canvas.rightSkus.some((s) => (s.xPosition ?? 0) === newXPos) ||
          canvas.topSkus.some(
            (s) => s !== sku && (s.xPosition ?? 0) === newXPos
          )
        ) {
          newXPos += dims.width;
        }
        if (newXPos + dims.width * (sku.quantity ?? 1) > canvas.width) {
          console.warn(
            `Cannot reassign SKU: New xPosition=${newXPos} exceeds canvas width=${canvas.width}px`
          );
          canvas.topSkus = canvas.topSkus.filter((s) => s !== sku);
          continue;
        }
        sku.xPosition = Math.min(
          newXPos,
          canvas.width - dims.width * (sku.quantity ?? 1)
        );
        sku.yPosition = 0;
        totalHeight = skuHeight;
      } else {
        sku.yPosition = totalHeight;
        totalHeight += skuHeight;
      }
    }

    canvas.topSkus = [...unaffectedSkus, ...affectedSkus];
    console.log(
      `Recalculated topSkus at x=${affectedXPosition}:`,
      affectedSkus.map((s) => `x=${s.xPosition}, y=${s.yPosition}`)
    );
  }

  private recalculateRightSkuPositions(canvasIndex: number): void {
    const canvas = this.canvases[canvasIndex];
    canvas.rightSkus = canvas.rightSkus || [];

    canvas.rightSkus.sort((a, b) => (a.xPosition ?? 0) - (b.xPosition ?? 0));
    let currentX = 0;
    for (const sku of canvas.rightSkus) {
      const dims = this.getSKUDimensions(sku);
      const skuWidth = dims.width * (sku.quantity ?? 1);
      if (currentX + skuWidth > canvas.width) {
        console.warn(
          `Right SKU at x=${currentX} exceeds canvas width=${canvas.width}px`
        );
        sku.xPosition = Math.max(0, canvas.width - skuWidth);
      } else {
        sku.xPosition = currentX;
      }
      currentX += skuWidth;
    }

    console.log(
      `Recalculated rightSkus:`,
      canvas.rightSkus.map((s) => `x=${s.xPosition}`)
    );
  }

  saveRackWidth(data: { width: number; unit: 'cm' | 'in' }): void {
    const widthInPx =
      data.unit === 'in'
        ? this.convertInToPx(data.width)
        : this.convertCmToPx(data.width);
    const oldWidthCm = this.rackWidthCm;
    this.rackWidthCm = data.unit === 'in' ? data.width * 2.54 : data.width;
    this.selectedStatusRackWidth = data.unit;

    console.log(
      `saveRackWidth: oldWidthCm=${oldWidthCm}, newWidthCm=${this.rackWidthCm}, newWidthPx=${widthInPx}`
    );

    this.updateScaleFactor();
    this.rackWidthPx = widthInPx;

    this.canvases.forEach((canvas, index) => {
      console.log(
        `Before updating canvas ${index}: width=${canvas.width}px, height=${canvas.height}px, rightSkus=`,
        canvas.rightSkus.map((s) => `x=${s.xPosition}`)
      );
      console.log(
        `Before updating canvas ${index}: topSkus=`,
        canvas.topSkus.map((s) => `x=${s.xPosition}, y=${s.yPosition}`)
      );

      canvas.width = this.rackWidthPx;

      // Reposition rightSkus contiguously from x=0
      canvas.rightSkus.sort((a, b) => (a.xPosition ?? 0) - (b.xPosition ?? 0));
      let currentX = 0;
      for (const sku of canvas.rightSkus) {
        const dims = this.getSKUDimensions(sku);
        const skuWidth = dims.width * (sku.quantity ?? 1);
        if (currentX + skuWidth > canvas.width) {
          console.warn(
            `Right SKU at x=${currentX} exceeds canvas width=${canvas.width}px`
          );
          sku.xPosition = Math.max(0, canvas.width - skuWidth);
        } else {
          sku.xPosition = currentX;
        }
        currentX += skuWidth;
      }

      // Adjust topSkus x-positions to align with rightSkus or find new positions
      const rightSkuXPositions = new Set(
        canvas.rightSkus.map((s) => s.xPosition ?? 0)
      );
      for (const sku of canvas.topSkus) {
        const dims = this.getSKUDimensions(sku);
        if (sku.xPosition !== undefined) {
          if (!rightSkuXPositions.has(sku.xPosition)) {
            let newXPos = 0; // Start at 0 if no right SKU aligns
            while (
              rightSkuXPositions.has(newXPos) ||
              canvas.topSkus.some(
                (s) => s !== sku && (s.xPosition ?? 0) === newXPos
              )
            ) {
              newXPos += dims.width;
            }
            if (newXPos + dims.width * (sku.quantity ?? 1) > canvas.width) {
              console.warn(
                `Cannot reassign top SKU: New xPosition=${newXPos} exceeds canvas width=${canvas.width}px`
              );
              sku.xPosition = Math.max(
                0,
                canvas.width - dims.width * (sku.quantity ?? 1)
              );
            } else {
              sku.xPosition = newXPos;
            }
          }
        }
      }

      // Recalculate positions
      this.recalculateRightSkuPositions(index);
      const affectedXPositions = [
        ...new Set(canvas.topSkus.map((s) => s.xPosition ?? 0)),
      ];
      affectedXPositions.forEach((xPos) =>
        this.recalculateTopSkuPositions(index, xPos)
      );

      // Log DOM dimensions after render
      setTimeout(() => {
        const canvasElement = document.querySelector(
          `.canvas-container:nth-child(${index + 2})`
        );
        if (canvasElement) {
          const domWidth = (canvasElement as HTMLElement).offsetWidth;
          const domHeight = (canvasElement as HTMLElement).offsetHeight;
          console.log(
            `Canvas ${index} DOM dimensions after render: width=${domWidth}px, height=${domHeight}px, expected: width=${canvas.width}px, height=${canvas.height}px`
          );
        }
      }, 0);

      console.log(
        `After updating canvas ${index}: width=${canvas.width}px, height=${canvas.height}px, rightSkus=`,
        canvas.rightSkus.map((s) => `x=${s.xPosition}`)
      );
      console.log(
        `After updating canvas ${index}: topSkus=`,
        canvas.topSkus.map((s) => `x=${s.xPosition}, y=${s.yPosition}`)
      );
    });

    this.closeModal('rackWidthModal');
    this.cdr.markForCheck();
    this.cdr.detectChanges();
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
    this.shelfHeightInput =
      data.unit === 'in' ? data.height * 2.54 : data.height;
    this.selectedStatusRackHeight = data.unit;

    console.log(
      `saveShelfHeight: index=${data.index}, heightCm=${this.shelfHeightInput}, heightPx=${heightInPx}, applyToAll=${data.applyToAll}`
    );

    if (data.applyToAll) {
      this.canvases.forEach((canvas, i) => {
        canvas.height = heightInPx;
        this.recalculateRightSkuPositions(i);
        const affectedXPositions = [
          ...new Set(canvas.topSkus.map((s) => s.xPosition ?? 0)),
        ];
        affectedXPositions.forEach((xPos) =>
          this.recalculateTopSkuPositions(i, xPos)
        );
      });
      this.rackHeight = heightInPx;
    } else {
      this.canvases[data.index].height = heightInPx;
      this.recalculateRightSkuPositions(data.index);
      const affectedXPositions = [
        ...new Set(
          this.canvases[data.index].topSkus.map((s) => s.xPosition ?? 0)
        ),
      ];
      affectedXPositions.forEach((xPos) =>
        this.recalculateTopSkuPositions(data.index, xPos)
      );
    }

    this.closeModal(`shelfHeightModal${data.index}`);
    this.cdr.detectChanges();
  }

  addNewCanvasWithHeight(data: { height: number; unit: 'cm' | 'in' }): void {
    const heightInPx =
      data.unit === 'in'
        ? this.convertInToPx(data.height)
        : this.convertCmToPx(data.height);
    this.shelfHeightInput =
      data.unit === 'in' ? data.height * 2.54 : data.height;
    this.selectedStatusRackHeight = data.unit;

    console.log(
      `addNewCanvasWithHeight: heightCm=${this.shelfHeightInput}, heightPx=${heightInPx}`
    );

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
    if (this.canvases.length > 1) {
      this.canvases.splice(index, 1);
    } else {
      console.warn('Cannot delete the last canvas');
      alert('Cannot delete the last shelf.');
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
    const canvasesWithSkus = this.canvases.map((canvas) => ({
      ...canvas,
      topSkus: canvas.topSkus.map((sku) => ({
        ...sku,
        xPosition: sku.xPosition ?? 0,
        yPosition: sku.yPosition ?? 0,
      })),
      rightSkus: canvas.rightSkus.map((sku) => ({
        ...sku,
        xPosition: sku.xPosition ?? 0,
        yPosition: sku.yPosition ?? 0,
      })),
    }));

    const planogram: Planogram = {
      id: this.planogramId ?? Date.now(),
      title: this.title,
      height: this.shelfHeightInput,
      width: this.rackWidthCm,
      canvases: canvasesWithSkus,
    };

    if (this.planogramId) {
      this.planogramService.updatePlanogram(this.planogramId, planogram);
    } else {
      this.planogramService.addPlanogram(planogram);
    }
    console.log('Planogram saved:', planogram);
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

  getSKUDimensions(sku: SKU): { width: number; height: number } {
    const dimensions = sku.dimensions
      .split('|')
      .map((d) => parseFloat(d.trim()));
    const width = dimensions[0];
    const height = dimensions[1];
    const multiplier =
      sku.unit === 'cm' ? this.scaleFactor : 2.54 * this.scaleFactor;
    return {
      width: width * multiplier,
      height: height * multiplier,
    };
  }

  async downloadPlanogram(): Promise<void> {
    const canvasContainers = document.querySelectorAll('.canvas-container');
    if (canvasContainers.length === 0) {
      alert('No planogram shelves to download.');
      return;
    }

    canvasContainers.forEach((container) =>
      container.classList.add('downloading')
    );

    try {
      let totalHeight = 0;
      let maxWidth = 0;
      const canvases: HTMLCanvasElement[] = [];

      for (const container of Array.from(canvasContainers)) {
        const canvas = await html2canvas(container as HTMLElement, {
          scale: 5,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        totalHeight += canvas.height;
        maxWidth = Math.max(maxWidth, canvas.width);
        canvases.push(canvas);
      }

      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = maxWidth;
      combinedCanvas.height = totalHeight;
      const ctx = combinedCanvas.getContext('2d');

      if (!ctx) {
        alert('Failed to create canvas context.');
        return;
      }

      let currentY = 0;
      for (const canvas of canvases) {
        ctx.drawImage(canvas, 0, currentY);
        currentY += canvas.height;
      }

      const link = document.createElement('a');
      link.download = `planogram-${this.title || 'untitled'}-${Date.now()}.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading planogram:', error);
      alert('Failed to download planogram.');
    } finally {
      canvasContainers.forEach((container) =>
        container.classList.remove('downloading')
      );
    }
  }

  openNewShelfModal(): void {
    this.shelfHeightInput = 400; // Default height
    this.selectedStatusRackHeight = 'cm';
    this.openModal('newShelfModal');
  }

  openShelfHeightModal(index: number): void {
    this.shelfHeightInput = this.canvases[index].height / this.scaleFactor;
    this.selectedStatusRackHeight = 'cm';
    this.applyToAll = false;
    this.openModal(`shelfHeightModal${index}`);
  }
}
