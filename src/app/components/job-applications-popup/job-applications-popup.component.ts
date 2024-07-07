import { Component, Input, Inject , ViewChild} from '@angular/core';
// src/app/components/tab1/tab1.component.ts
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { JobApplicationComponent } from '../job-application/job-application.component';


@Component({
  selector: 'app-job-applications-popup',
  templateUrl: './job-applications-popup.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class JobApplicationsPopupComponent 
{
  @ViewChild(JobApplicationComponent) jaPage: JobApplicationComponent;
  constructor(
      public dialogRef: MatDialogRef<JobApplicationsPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, 
      paramService:ParamService, 
      protected dataService: GenericDataService, 
      protected popupService: PopupService) {
  }

    ngOnInit(): void {
    console.log('Rows received:', this.data); // Access passed data
  }

  ngAfterViewInit(): void {
    // Initialize the fields in JobApplicationComponent after the view has been initialized
    if (this.jaPage) {
      this.jaPage.initializeFieldsForDialog();
      this.jaPage.agGrid.loadGridColAndRows(this.data)
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
