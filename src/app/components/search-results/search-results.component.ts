import { ConversationDialogComponent } from '../../components/conversation-dialog/conversation-dialog.component'
import { MatSelectChange } from '@angular/material/select';
import { Component, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; // Adjust the path based on your setup
import { MessageDialogComponent } from '../app-message-dialog/app-message-dialog.component'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent extends BaseTabComponent {
  api_end_point = null;
  sp = "";
  table_name = null;

  view_name = "search_results"
  display_on_load = false
  public selectedView: string = null
  
    ngOnInit() {
    this.dataSharingService.data$.subscribe(data => {
      this.showGrid(data);
      // Optionally, perform any necessary logic with the received data
    });
  }

  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": null, "sp": "", "table_name": null, "display_on_load": false })
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog) {
    super(data, paramService, dataService, popupService, { "api_end_point": null, "sp": "", "table_name": null, "display_on_load": true });
  }

}
