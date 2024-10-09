import { Component, Input, Inject } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-log-tab',
  templateUrl: './log-tab.component.html',
  styleUrl: './log-tab.component.css'
})
export class LogTabComponent extends BaseTabComponent {
  onClickRefreshLog()
  {
    this.dataService.fetchDataPost('show_log', null, {}).subscribe(data => {
      this.showGrid(data)
    });


  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, private communicationService:CommunicationService) {
    super(data, paramService, dataService, popupService, { "api_end_point": "show_log", "sp": "", "table_name": "dblog", "display_on_load": true });
  }

}
