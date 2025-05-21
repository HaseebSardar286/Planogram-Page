import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';

@Component({
  selector: 'app-sku',
  imports: [NgIf, NgxFileDropModule, FormsModule],
  templateUrl: './sku.component.html',
  styleUrl: './sku.component.css',
})
export class SkuComponent {
  constructor(private router: Router) {}
  addSKU() {
    this.router.navigate(['/dashboard/createPlanogram']);
  }

  projectDetails = {};
  addProject(values: any) {}
  cancelAddition() {
    this.router.navigate(['/SKU']);
  }

  selectedStatus: string = '';
  selectedStatusCategory: string = '';
  dropdownOpen = false;
  dropdownOpenCategory = false;
  selectStatus(status: string) {
    this.selectedStatus = status;
  }
  toggleDropDown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleDropDownCategory() {
    this.dropdownOpenCategory = !this.dropdownOpenCategory;
  }
  selectStatusCategory(status: string) {
    this.selectedStatusCategory = status;
  }

  imagePreviewUrl: null | string = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => this.previewImage(file));
      }
    }
  }
  public fileBrowseHandler(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.previewImage(file);
    }
  }
  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  imagePreviewUrl1: null | string = null;
  @ViewChild('fileInput') fileInputRef1!: ElementRef;
  public dropped1(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => this.previewImage1(file));
      }
    }
  }
  public fileBrowseHandler1(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.previewImage1(file);
    }
  }
  private previewImage1(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl1 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  imagePreviewUrl2: null | string = null;
  @ViewChild('fileInput') fileInputRef2!: ElementRef;
  public dropped2(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => this.previewImage2(file));
      }
    }
  }
  public fileBrowseHandler2(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.previewImage2(file);
    }
  }
  private previewImage2(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl2 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
