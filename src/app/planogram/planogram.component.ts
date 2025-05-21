import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { Planogram } from '../interfaces/planograms';
import { PlanogramService } from '../services/planogram.service';

@Component({
  selector: 'app-planogram',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './planogram.component.html',
  styleUrls: ['./planogram.component.css'],
})
export class PlanogramComponent implements OnInit {
  searchQuery: string = '';
  selectedStatus: string = 'All Status';
  selectedStatusRackWidth: string = 'cm';
  dropdownOpen = false;
  dropdownOpenRackWidth = false;
  title: string = '';
  rackWidth: number = 20;
  planograms: Planogram[] = [];

  constructor(
    private router: Router,
    private planogramService: PlanogramService
  ) {}
  ngOnInit() {
    this.planograms = this.planogramService.getPlanograms();
  }

  getFilteredPlanograms(): Planogram[] {
    return this.planograms.filter(
      (planogram) =>
        (this.selectedStatus === 'All Status' ||
          this.selectedStatus === 'Select All' ||
          planogram.approvalStatus === this.selectedStatus) &&
        (!this.searchQuery ||
          planogram.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()))
    );
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
  }

  selectStatusRackWidth(status: string) {
    this.selectedStatusRackWidth = status;
    this.dropdownOpenRackWidth = false;
  }

  toggleDropDown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropDownRackWidth() {
    this.dropdownOpenRackWidth = !this.dropdownOpenRackWidth;
  }

  planogramEditor() {
    if (!this.title.trim()) {
      alert('Please enter a planogram title.');
      return;
    }
    if (this.rackWidth <= 0 || isNaN(this.rackWidth)) {
      alert('Please enter a valid rack width.');
      return;
    }

    let rackWidthInCm =
      this.selectedStatusRackWidth === 'in'
        ? this.rackWidth * 2.54
        : this.rackWidth;

    this.router.navigate(['/planogram-editor'], {
      state: { title: this.title, rackWidth: rackWidthInCm },
    });

    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      modal.hide();
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove('.modal-open');
      document.body.style.overflow = '';
    }

    this.title = '';
    this.rackWidth = 100;
    this.selectedStatusRackWidth = 'cm';
  }

  editPlanogram(planogram: Planogram) {
    this.router.navigate(['/planogram-editor'], {
      state: {
        title: this.title,
        rackWidth: planogram.width,
        height: planogram.height,
        id: planogram.id,
      },
    });
    console.log(planogram);
  }

  deletePlanogram(id: number) {
    if (confirm('Are you sure you want to delete this planogram?')) {
      this.planogramService.deletePlanogram(id);
      this.planograms = this.planogramService.getPlanograms();
    }
  }
}
