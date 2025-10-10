import { Component, OnInit } from '@angular/core';
import { ConversationDialogComponent } from '../../components/conversation-dialog/conversation-dialog.component'
import { MatSelectChange } from '@angular/material/select';
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
import { FacebookPostDialogComponent } from '../facebook-post-dialog/facebook-post-dialog.component';
import { TravelDialogComponent } from '../travel-dialog/travel-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-control-page',
  templateUrl: './control-page.component.html',
  styleUrls: ['./control-page.component.css']
})
export class ControlPageComponent implements OnInit {
  stateStatus: string = '';

  constructor(private http: HttpClient, protected dataService: GenericDataService) {
  
    }
  
    scrapeLogData: any[] = [];
scrapeColumnDefs = [
  { headerName: 'Site Name', field: 'site_name', sortable: true, filter: true },
  { headerName: 'Start Time', field: 'start_time', sortable: true, filter: true },
  { headerName: 'End Time', field: 'end_time', sortable: true, filter: true },
  { headerName: 'Record Count', field: 'record_count', sortable: true, filter: true },
  { headerName: 'Status', field: 'status', sortable: true, filter: true },
  { headerName: 'Log ID', field: 'scrape_log_id', sortable: true, filter: true }
];

loadLastScrapesPerSite(): void {
  this.dataService.fetchData('scrape/last-run-per-site', null, {}).subscribe(res => {
    this.scrapeLogData = res;
  });
}


  ngOnInit(): void {
  this.refresh();
}

refresh(): void {
  this.getStatus();
  this.loadLastScrapesPerSite();
}

  getStatus(): void {
    this.dataService.fetchData('broadcast/status', null, {}).subscribe(res => {
      this.stateStatus = res.status;
    });
  }

  setBroadcast(status: 'Stopped' | 'Running'): void {
    this.dataService.fetchDataPost('broadcast/set', null,{ "status":status }).subscribe(() => {
      this.getStatus();
    });
  }
}
