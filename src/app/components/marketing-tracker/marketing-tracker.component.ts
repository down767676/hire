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
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSelectChange } from '@angular/material/select';
import { MessageDialogComponent } from '../app-message-dialog/app-message-dialog.component';
import { EmailMessageDialogComponent } from '../app-email-message-dialog/app-email-message-dialog.component';

@Component({
  selector: 'app-marketing-tracker',
  templateUrl: './marketing-tracker.component.html',
  styleUrls: ['./marketing-tracker.component.css']
})
export class MarketingTrackerComponent extends BaseTabComponent {

  public refreshCursor: boolean = false;
  private apiUrl = environment.apiUrl;
  selectedMessageType: string = '';

  searchFields = ['field1', 'field2'];
  selectedOptions = ['', ''];
  api_end_point = "get_marketing_tracker";
  sp = "";
  table_name = "marketing_tracker";
  display_on_load = false;

  selectedTask: String = "AllContacts.30";

  public tasks = [
    { "code": "AllContacts.30", "value": "All Contacts in last 30 days" },
    { "code": "AllContacts.60", "value": "All Contacts in last 60 days" },
    { "code": "AllContacts.90", "value": "All Contacts in last 90 days" },
    { "code": "AllContacts.All", "value": "All Contacts" }
  ];

  someMethod(): void {
    console.log('Implemented abstract method');
  }

  initializeFields(): void {
    this.setParentAttributes({
      "api_end_point": this.api_end_point,
      "sp": "",
      "table_name": "marketing_tracker",
      "display_on_load": true
    });
  }

  initializeFieldsForDialog(): void {
    this.setParentAttributes({
      "api_end_point": "",
      "sp": "",
      "table_name": "marketing_tracker",
      "display_on_load": false
    });
  }

  get sendLabel(): string {
    return this.agGrid?.clearOtherRowsOnSelect ? 'Send Single' : 'Send Bulk';
  }

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    paramService: ParamService,
    protected dataService: GenericDataService,
    protected popupService: PopupService,
    private dataSharingService: DataSharingService,
    public dialog: MatDialog
  ) {
    super(data, paramService, dataService, popupService, {
      "api_end_point": "get_marketing_tracker",
      "sp": "",
      "table_name": "marketing_tracker",
      "display_on_load": true
    });
  }

  ngOnInit() {
    this.dataSharingService.data$.subscribe(data => {
      this.showGrid(data);
    });
  }

  onTaskChange(event: MatSelectChange) {
    this.go(this.selectedTask);
  }

  ngAfterViewInit(): void {
    this.dataService.fetchDataPost('get_marketing_tracker', null, {
      'task': this.selectedTask,
      'source': 'WBENC'
    }).subscribe(data => {
      this.showGrid(data);
    });
  }

  onClickRefreshMarketingContacts() {
    this.go(this.selectedTask);
  }

  go(selectedTask) {
    if (this.isValid(selectedTask)) {
      this.refreshCursor = this.showWait(this.refreshCursor);
      this.dataService.fetchDataPost('get_marketing_tracker', null, {
        'task': selectedTask,
        'source': 'WBENC'
      }).subscribe(data => {
        this.showGrid(data);
        this.refreshCursor = this.hideWait(this.refreshCursor);
      });
    }
  }

  getMarketingSelectedIds(): number[] {
    const selectedIds: number[] = [];
    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['marketing_tracker_id']);
      }
    });
    return selectedIds;
  }

  getFirstSelectedRow(): any {
    var retRow = null;
    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        retRow = row;
      }
    });
    return retRow;
  }

  onCreateMessage() {
    const scenario = this.selectedMessageType;
    if (!scenario) {
      alert("Message type must be selected.");
      return;
    }

    const isEmail = true; // Marketing tracker uses emails by default
    const endpoint = isEmail ? 'get_marketing_email_message' : 'get_marketing_message';

    const selectedIds = this.getMarketingSelectedIds();
    if (selectedIds.length === 0) {
      alert("Please select at least one contact.");
      return;
    }

    const selectedRows = this.agGrid.rowData.filter(row => selectedIds.includes(row.marketing_tracker_id));

    const previewRow = selectedRows[0];
    const actualScenario = scenario === 'initial_outreach' ? previewRow.email_template : scenario;
    const jsonData = {
      email: previewRow.primary_contact_email,
      scenario: actualScenario
    };

    this.dataService.fetchDataPost(endpoint, null, jsonData).subscribe(async data => {
      const dialogRef = isEmail
        ? this.dialog.open(EmailMessageDialogComponent, {
            width: '70vw',
            maxWidth: '70vw',
            height: '70vh',
            data: {
              email: {
                from: data.from,
                to: data.to,
                subject: data.subject,
                body: data.body
              },
              sendLabel: this.sendLabel
            }
          })
        : this.dialog.open(MessageDialogComponent, {
            width: '70vw',
            maxWidth: '70vw',
            height: '70vh',
            data: {
              message: data,
              sendLabel: this.sendLabel
            }
          });

      dialogRef.afterClosed().subscribe(async result => {
        if (!result) return;

        for (const row of selectedRows) {
          const delay = Math.floor(Math.random() * 5000) + 5000; // 5000ms to 10000ms
          const name = row.primary_contact_first_name || 'Supplier Diversity Team';
          const marketing_tracker_id = row.marketing_tracker_id;
          const rowScenario = scenario === 'initial_outreach' ? row.email_template : scenario;

          if (isEmail) {
            const personalizedBody = result.body?.replace(/^Hi\s+\w+/i, `Hi ${name}`) || '';
            const payload = {
              scenario: rowScenario,
              marketing_tracker_id,
              from: result.from?.trim(),
              to: row.primary_contact_email || result.to?.trim(),
              subject: result.subject?.trim(),
              body: personalizedBody,
              content_type: "HTML",
              attachments: ["Zenex Partners Capabilities Statement.pdf"]
            };

            await this.dataService.fetchDataPost('send_marketing_email', null, payload).toPromise();
          } else {
            const personalizedMessage = result.replace(/^Hi\s+\w+/i, `Hi ${name}`);
            const payload = {
              scenario: rowScenario,
              marketing_tracker_id,
              message: personalizedMessage
            };

            await this.dataService.fetchDataPost('send_marketing_text', null, payload).toPromise();
          }

          // Wait for random delay between 5 and 10 seconds
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      });
    });
  }
}