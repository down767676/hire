import { Component, Input, Inject } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';



@Component({
  selector: 'app-status-report-tab',
  templateUrl: './status-report-tab.component.html',
  styleUrl: './status-report-tab.component.css'
})
export class StatusReportTabComponent extends BaseTabComponent {
  someMethod(): void {
    console.log('Implemented abstract method');
  }

  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": "get_sourcing_status_report", "sp": "", "table_name": "dynamic", "display_on_load": true })
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService) {
    super(data, paramService, dataService, popupService, { "api_end_point": "get_sourcing_status_report", "sp": "", "table_name": "dynamic", "display_on_load": true });
  }

}
