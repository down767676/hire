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

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent extends BaseTabComponent {

  public showPleaseWaitCursor: boolean = false
  searchFields = ['field1', 'field2'];
  selectedOptions = ['', ''];
  api_end_point = "search_candidates";
  sp = "";
  table_name = "jobapplication";
  display_on_load = false
  public source_columns = ["all"];
  public selectedView: string = null
  public selected_source = this.source_columns[0]

  selectedTask: String = "TalkTo.30"
  public tasks = [
    { "code": "NotTexted.3", "value": "Not Texted (Searched in last 3 days)" },
    { "code": "NotTexted.7", "value": "Not Texted (Searched in last 7 days)" },
    { "code": "NotTexted.15", "value": "Not Texted (Searched in last 15 days)" },
    { "code": "NotTexted.30", "value": "Not Texted (Searched in last 30 days)" },
    { "code": "NotTexted.60", "value": "Not Texted (Searched in last 60 days)" },
    { "code": "NotTexted.90", "value": "Not Texted (Searched in last 90 days)" },
    { "code": "NotTexted.365", "value": "Not Texted (Searched in last 365 days)" },
    { "code": "Texted.3", "value": "Texted in last 3 days" },
    { "code": "Texted.7", "value": "Texted in last 7 days" },
    { "code": "Texted.15", "value": "Texted in last 15 days" },
    { "code": "Texted.30", "value": "Texted in last 30 days" },
    { "code": "Texted.60", "value": "Texted in last 60 days" },
    { "code": "Texted.90", "value": "Texted in last 90 days" },
    { "code": "Texted.365", "value": "Texted in last 365 days" },
    { "code": "Responded.3", "value": "Responded in last 3 days" },
    { "code": "Responded.7", "value": "Responded in last 7 days" },
    { "code": "Responded.15", "value": "Responded in last 15 days" },
    { "code": "Responded.30", "value": "Responded in last 30 days" },
    { "code": "Responded.60", "value": "Responded in last 60 days" },
    { "code": "Responded.90", "value": "Responded in last 90 days" },
    { "code": "Responded.365", "value": "Responded in last 365 days" },
    { "code": "TalkTo.3", "value": "Talk To in last 3 days" },
    { "code": "TalkTo.7", "value": "Talk To in last 7 days" },
    { "code": "TalkTo.15", "value": "Talk To in last 15 days" },
    { "code": "TalkTo.30", "value": "Talk To in last 30 days" },
    { "code": "TalkTo.60", "value": "Talk To in last 60 days" },
    { "code": "TalkTo.90", "value": "Talk To in last 90 days" },
    { "code": "TalkTo.365", "value": "Talk To in last 365 days" }


  ]

  someMethod(): void {
    console.log('Implemented abstract method');
  }

  // initializeFields(): void {
  //   this.setParentAttributes({ "api_end_point": "get_campaign", "sp": "", "table_name": "jobapplication", "display_on_load": true })
  // }
  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": this.api_end_point, "sp": "", "table_name": "jobapplication", "display_on_load": true })

  }

  initializeFieldsForDialog(): void {
    this.setParentAttributes({ "api_end_point": "", "sp": "", "table_name": "jobapplication", "display_on_load": false })
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog) {
    super(data, paramService, dataService, popupService, { "api_end_point": "get_campaign", "sp": "", "table_name": "candidateprofile", "display_on_load": true });

  }

  getSearchParams(): any {
    let job_ids = this.extractCheckedIDs("job_id");
    let params = { "job_ids": job_ids, "minimum_should_match": 1 }
  }

  getSendTextParams(): any {
    let ids = this.getMobileSelectedIds();
    let params = { "jobapplication_ids": ids, "source": "npi", "mode": "Test" }
    return params
  }

  getMobileSelectedIds(): number[] {
    const selectedIds: number[] = [];

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['jobapplication_id']);
      }
    })
    return selectedIds;
  }

  sendEmail() {
    super.sendEmail();
    // Add additional logic for sending email
    console.log('Additional email logic');
  }

  sendText(params): void {
    // const params = this.buildSearchParams();
    // this.showPleaseWaitCursor = this.showWait(this.showPleaseWaitCursor);
    // this.dataService.fetchDataPost('send_batch', null, params).subscribe(data => {
    //   this.showPleaseWaitCursor = this.hideWait(this.showPleaseWaitCursor);
    // });
    this.dataService.fetchDataPost('send_batch', null, params);
  }

  ngOnInit() {
    this.dataSharingService.data$.subscribe(data => {
      this.showGrid(data);
      // Optionally, perform any necessary logic with the received data
    });
  }

  onClickSendText() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Text Candidates',
        content: 'All Texts will be sent within 15 minutes depending on the number of texts to be sent. You can check the text sent using the Text Sent in last 3 days Task',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // OK button was clicked
        let params = this.getSendTextParams()
        this.sendText(params);
      } else {
        // Cancel button was clicked
        console.log('User canceled the action');
      }
    });


  }

  onTaskChange(event: MatSelectChange) {
    this.go(this.selectedTask);
  }

  ngAfterViewInit(): void {
    this.dataService.fetchDataPost('jobapplications', null, { 'task': this.selectedTask }).subscribe(data => {
      this.showGrid(data);
    })

    // this.agGrid.loadGridColAndRows(this.data)
  }

  go(selectedTask) {
    if (this.isValid(selectedTask)) {
      this.dataService.fetchDataPost('jobapplications', null, { 'task': selectedTask }).subscribe(data => {
        this.showGrid(data);
      })
    }
  }
}
