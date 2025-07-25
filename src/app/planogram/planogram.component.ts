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
  selectedStatusRackHeight: string = 'cm';
  dropdownOpen: boolean = false;
  dropdownOpenRackWidth: boolean = false;
  title: string = '';
  rackWidth: number = 50;
  rackHeight: number = 50;
  planograms: Planogram[] = [];
  selectedCategory: string = '';
  selectedShop: string = '';
  selectedChannel: string = '';
  dropdownOpenCategory: boolean = false;
  dropdownOpenChannel: boolean = false;
  dropdownOpenRackHeight: boolean = false;
  dropdownOpenShop: boolean = false;

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

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
  selectChannel(category: string) {
    this.selectedChannel = category;
  }
  selectShop(category: string) {
    this.selectedShop = category;
  }
  selectStatusRackWidth(status: string) {
    this.selectedStatusRackWidth = status;
    this.dropdownOpenRackWidth = false;
  }

  selectStatusRackHeight(status: string) {
    this.selectedStatusRackHeight = status;
    this.dropdownOpenRackHeight = false;
  }

  toggleDropDown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropDownRackWidth() {
    this.dropdownOpenRackWidth = !this.dropdownOpenRackWidth;
  }

  toggleDropDownCategory() {
    this.dropdownOpenCategory = !this.dropdownOpenCategory;
  }

  toggleDropDownChannel() {
    this.dropdownOpenChannel = !this.dropdownOpenChannel;
  }

  toggleDropDownShop() {
    this.dropdownOpenShop = !this.dropdownOpenShop;
  }

  toggleDropDownRackHeight() {
    this.dropdownOpenRackHeight = !this.dropdownOpenRackHeight;
  }

  planogramEditor() {
    if (!this.title.trim()) {
      alert('Please enter a planogram title.');
      return;
    }
    if (!this.selectedCategory) {
      alert('Please select a category.');
      return;
    }
    if (!this.selectedChannel) {
      alert('Please select a channel.');
      return;
    }
    if (!this.selectedShop) {
      alert('Please select a shop.');
      return;
    }
    if (!this.rackWidth || this.rackWidth <= 0 || isNaN(this.rackWidth)) {
      alert('Please enter a valid rack width.');
      return;
    }

    if (!this.rackHeight || this.rackHeight <= 0 || isNaN(this.rackHeight)) {
      alert('Please enter a valid rack height.');
      return;
    }

    let rackWidthInCm =
      this.selectedStatusRackWidth === 'in'
        ? this.rackWidth * 2.54
        : this.rackWidth;

    let rackHeightInCm =
      this.selectedStatusRackHeight === 'in'
        ? this.rackHeight * 2.54
        : this.rackHeight;

    this.router.navigate(['/planogram-editor'], {
      state: {
        title: this.title,
        rackWidth: rackWidthInCm,
        rackHeight: rackHeightInCm,
        selectedCategory: this.selectedCategory,
        selectedShop: this.selectedShop,
        selectedChannel: this.selectedChannel,
      },
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
    this.rackWidth = rackWidthInCm;
    this.selectedStatusRackWidth = 'cm';
    this.rackHeight = rackHeightInCm;
    this.selectedStatusRackHeight = 'cm';
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
