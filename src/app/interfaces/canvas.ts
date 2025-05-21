export interface Canvas {
  id: number;
  width: number;
  height: number;
  context?: CanvasRenderingContext2D;
  selectedSKU?:
    | {
        id: string;
        image: string;
        heightPx: number;
        widthPx: number;
      }
    | undefined;
}
