export interface SKU {
  id: string;
  name: string;
  category: string;
  skuId: string;
  description: string;
  unit: 'cm' | 'in';
  dimensions: string;
  imageUrl: string;
  quantity: number;
  xPosition?: number;
  yPosition?: number;
}

export interface Canvas {
  id: number;
  width: number;
  height: number;
  topSkus: SKU[];
  rightSkus: SKU[];
  tempPosition?: 'top' | 'right';
  tempSkuIndex?: number;
}

export interface Planogram {
  id: number;
  title: string;
  height: number;
  width: number;
  canvases: Canvas[];
}
