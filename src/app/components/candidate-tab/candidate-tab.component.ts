// src/app/components/tab1/tab1.component.ts
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
  selector: 'app-candidate-tab',
  // templateUrl: '../base-tab/base-tab.component.html',
  templateUrl: './candidate-tab.component.html',
  styleUrls: ['./candidate-tab.component.css']
})
export class CandidateTabComponent extends BaseTabComponent {
  public conversationCursor: boolean = false
  public refreshCursor: boolean = false

  searchFields = ['field1', 'field2'];
  selectedOptions = ['', ''];
  api_end_point = "candidateprofiles";
  sp = "";
  table_name = "candidateprofile";
  display_on_load = false
  public source_columns = ["all"];
  public selectedView: string = null
  public selected_source = this.source_columns[0]

  selectedTask: String = "Ceipal.1"
  public tasks = [
    { "code": "Working.1", "value": "Working for us" },
    { "code": "Ceipal.1", "value": "Ceipal last 1 days" },
    { "code": "Ceipal.2", "value": "Ceipal last 2 days" },
    { "code": "Ceipal.3", "value": "Ceipal last 3 days" },
    { "code": "Ceipal.5", "value": "Ceipal last 5 days" },
    { "code": "Ceipal.8", "value": "Ceipal last 8 days" },
    { "code": "Ceipal.15", "value": "Ceipal last 15 days" },
    { "code": "Ceipal.30", "value": "Ceipal last 30 days" },
    { "code": "Ceipal.60", "value": "Ceipal last 60 days" },
    { "code": "Ceipal.90", "value": "Ceipal last 90 days" },
    { "code": "Ceipal.150", "value": "Ceipal last 150 days" },
    { "code": "Ceipal.360", "value": "Ceipal last 360 days" }
  ]

  someMethod(): void {
    console.log('Implemented abstract method');
  }

  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": this.api_end_point, "sp": "", "table_name": "candidateprofile", "display_on_load": true })

  }

  initializeFieldsForDialog(): void {
    this.setParentAttributes({ "api_end_point": "", "sp": "", "table_name": "candidateprofile", "display_on_load": false })
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog) {
    super(data, paramService, dataService, popupService, { "api_end_point": "candidateprofiles", "sp": "", "table_name": "candidateprofile", "display_on_load": true });

  }


  getSearchParams(): any {
    let job_ids = this.extractCheckedIDs("job_id");
    let params = { "job_ids": job_ids, "minimum_should_match": 1 }
  }
  getSelectedColVal(name): string {
    let value = null;

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        value = (row.data[name]);
      }
    })
    return value;
  }

  getMobileSelectedIds(): number[] {
    const selectedIds: number[] = [];

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['candidateprofile_id']);
      }
    })
    return selectedIds;
  }

  getFirstSelectedRow(): any {
    var retRow = null;
    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        retRow = row;
      }
    })
    return retRow;
  }

  ngOnInit() {
    this.dataSharingService.data$.subscribe(data => {
      this.showGrid(data);
      // Optionally, perform any necessary logic with the received data
    });
  }


  onTaskChange(event: MatSelectChange) {
    this.go(this.selectedTask);
  }

  ngAfterViewInit(): void {
    this.dataService.fetchDataPost('candidateprofiles', null, { 'task': this.selectedTask, 'source': this.selected_source }).subscribe(data => {
      this.showGrid(data);
    })

    // this.agGrid.loadGridColAndRows(this.data)
  }

  onClickRefreshCandidateProfiles() {
    // let params = this.getSearchCandididateParams()
    this.go(this.selectedTask);
  }
  go(selectedTask) {
    if (this.isValid(selectedTask)) {
      this.refreshCursor = this.showWait(this.refreshCursor);
      this.dataService.fetchDataPost('candidateprofiles', null, { 'task': selectedTask }).subscribe(data => {
        this.showGrid(data);
        this.refreshCursor = this.hideWait(this.refreshCursor);
      })
    }
  }
}
