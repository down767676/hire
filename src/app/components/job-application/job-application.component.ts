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
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent extends BaseTabComponent {

  public showPleaseWaitCursor: boolean = false
  selectedMessageType: string = '';

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
    { "code": "NotTextedCount.100", "value": "Not Texted (Last 100)" },
    { "code": "NotTextedCount.200", "value": "Not Texted (Last 200)" },
    { "code": "NotTextedCount.300", "value": "Not Texted (Last 300)" },
    { "code": "NotTextedCount.400", "value": "Not Texted (Last 400)" },
    { "code": "NotTextedCount.500", "value": "Not Texted (Last 500)" },
    { "code": "NotTextedDays.1", "value": "Not Texted (Searched in last 1 days)" },
    { "code": "NotTextedDays.2", "value": "Not Texted (Searched in last 2 days)" },
    { "code": "NotTextedDays.3", "value": "Not Texted (Searched in last 3 days)" },
    { "code": "NotTextedDays.7", "value": "Not Texted (Searched in last 7 days)" },
    { "code": "NotTextedDays.15", "value": "Not Texted (Searched in last 15 days)" },
    { "code": "NotTextedDays.30", "value": "Not Texted (Searched in last 30 days)" },
    { "code": "NotTextedDays.60", "value": "Not Texted (Searched in last 60 days)" },
    { "code": "NotTextedDays.90", "value": "Not Texted (Searched in last 90 days)" },
    { "code": "NotTextedDays.365", "value": "Not Texted (Searched in last 365 days)" },
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

  onSendMessage() {
    var ids = this.getMobileSelectedIds()

    if (ids.length > 1) {
      alert('Error: More than one row has the value "yes"');
      return;
    } else if (ids.length === 0) {
      alert('No row with "yes" selected');
      return;
    }

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {

        if (result) {
        var row = this.getFirstSelectedRow()
        const message = result.message;
        const jsonData = {
          first_name: row.data.first_name,
          last_name: row.data.last_name,
          mobile: row.data.mobile,
          jobapplication_id: row.data.jobapplication_id,
          message: message,
          scenario:this.selectedMessageType
        };

        // Send JSON to Python service
        this.dataService.fetchDataPost('send_text', null, jsonData).subscribe(data => {
        });

      }
    });
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

  getFirstSelectedRow(): any {
    var retRow = null;
    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        retRow =  row;
      }
    })
    return retRow;
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
    // this.dataService.fetchDataPost('send_batch', null, params);
    this.dataService.fetchDataPost('send_batch', null, params).subscribe(data => {
    });

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
