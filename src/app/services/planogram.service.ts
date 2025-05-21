// src/app/services/planogram.service.ts
import { Injectable } from '@angular/core';
import { Planogram } from '../interfaces/planograms';

@Injectable({
  providedIn: 'root',
})
export class PlanogramService {
  private planograms: Planogram[] = [];

  getPlanograms(): Planogram[] {
    console.log('Returning planograms:', this.planograms);
    return this.planograms;
  }

  addPlanogram(planogram: Planogram): void {
    this.planograms.push(planogram);
    console.log(
      'Added planogram:',
      planogram,
      'Total planograms:',
      this.planograms
    );
  }

  updatePlanogram(id: number, updatedPlanogram: Planogram): void {
    const index = this.planograms.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.planograms[index] = { ...updatedPlanogram, id };
      console.log(
        'Updated planogram:',
        updatedPlanogram,
        'Total planograms:',
        this.planograms
      );
    }
  }

  deletePlanogram(id: number): void {
    this.planograms = this.planograms.filter((p) => p.id !== id);
    console.log(
      'Deleted planogram with id:',
      id,
      'Total planograms:',
      this.planograms
    );
  }
}
