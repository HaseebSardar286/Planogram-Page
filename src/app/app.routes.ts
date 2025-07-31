import { Routes } from '@angular/router';
import { PlanogramComponent } from './planogram/planogram.component';
import { SkuComponent } from './sku/sku.component';
import { PlanogramEditorComponent } from './planogram-editor/planogram-editor.component';

export const routes: Routes = [
  { path: 'SKU', component: SkuComponent },
  { path: 'planogram-editor', component: PlanogramEditorComponent },
  { path: 'planograms', component: PlanogramComponent },
  { path: '', redirectTo: 'planograms', pathMatch: 'full' },
];
