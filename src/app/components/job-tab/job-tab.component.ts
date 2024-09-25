// src/app/components/tab1/tab1.component.ts
import { Component, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { ParamService } from 'src/app/services/param-service.service';
import { DataService } from 'src/app/data.service';
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MatButtonModule } from '@angular/material/button';
import { JobApplicationsPopupComponent } from '../job-applications-popup/job-applications-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BASE_CLASS_PARAMS } from '../base-tab/base-tab.tokens';
import { Injectable } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; // Adjust the path based on your setup

@Component({
  selector: 'app-jobtab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class JobTabComponent extends BaseTabComponent {

  public onClickSearchCandidatesWaitCursor: boolean = false;
  public onClickSearchCeipalJobsWaitCursor: boolean = false;

  public onClickClusterJobsWaitCursor: boolean = false;
  public onClickRefreshJobsWaitCursor: boolean = false;
  public source_columns = ["ceipal"];

  public selectedView: string = null
  public selected_source = this.source_columns[0]



  someMethod(): void {
    console.log('Implemented abstract method');
  }


  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": "get_ceipal_jobs", "sp": "", "table_name": "job", "display_on_load": true })

  }

  // component = JobT abComponent
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, protected paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog) {
    super(data, paramService, dataService, popupService, { "api_end_point": "get_ceipal_jobs", "sp": "", "table_name": "job", "display_on_load": true });
  }

  searchAndSendData(api_end_point, sp, params): void {
    // const params = this.buildSearchParams();
    this.onClickSearchCandidatesWaitCursor = this.showWait(this.onClickSearchCandidatesWaitCursor);
    this.dataService.fetchDataPost(api_end_point, sp, params).subscribe(data => {
      this.dataSharingService.setData(data);
      this.changeTabEvent.emit(1);
      this.onClickSearchCandidatesWaitCursor = this.hideWait(this.onClickSearchCandidatesWaitCursor);
    });
  }

  searchAndSendDataFireAndForget(api_end_point, sp, params): void {
    this.dataService.fetchDataPost(api_end_point, sp, params).subscribe(data => {
      this.dataSharingService.setData(data);
    });
  }

  @Output() changeTabEvent = new EventEmitter<number>();
  onClickSearchCandidates() {

    // Open dialog
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      // let params = this.getSearchCandididateParams()
      let params = this.getSearchNPIParams()
      // this.searchAndOpenPopup("search_candidates", null, params, JobApplicationsPopupComponent)
      this.searchAndSendDataFireAndForget("search_candidates", null, params);
    });
  }

  onClickGetCeipalJobs() {
    this.onClickSearchCeipalJobsWaitCursor = this.showWait(this.onClickSearchCeipalJobsWaitCursor);
    this.dataService.fetchDataPost('upsert_ceipal_jobs', null, { "days": "30" }).subscribe(data => {
      this.onClickSearchCeipalJobsWaitCursor = this.hideWait(this.onClickSearchCeipalJobsWaitCursor);
    })
  }

  onClickClusterJobs() {
    // let params = this.getSearchCandididateParams()
    let params = this.getSearchNPIParams()
    this.onClickClusterJobsWaitCursor = this.showWait(this.onClickClusterJobsWaitCursor);
    this.dataService.fetchDataPost('get_clustered_jobs', null, params).subscribe(data => {
      this.showGrid(data)
      this.onClickClusterJobsWaitCursor = this.hideWait(this.onClickClusterJobsWaitCursor);
    });
  }

  onClickRefreshJobs() {
    // let params = this.getSearchCandididateParams()
    let params = this.getSearchNPIParams()
    this.onClickRefreshJobsWaitCursor = this.showWait(this.onClickRefreshJobsWaitCursor);
    this.dataService.fetchDataPost('get_ceipal_jobs', null, params).subscribe(data => {
      this.showGrid(data)
      this.onClickRefreshJobsWaitCursor = this.hideWait(this.onClickRefreshJobsWaitCursor);
    });
  }




  getSearchCandididateParams(): any {
    let job_ids = this.extractCheckedIDs("job_id");
    let params = { "job_ids": job_ids, "minimumsource_should_match": 1, "source": "elastic", "search_by": "state" }

    return params
  }


  getSearchNPIParams(): any {
    let job_ids = this.getSelectedIds("job_id");
    let params = { "job_ids": job_ids, "source": "npi", "search_by": "zip_code", "mode": "Production" }
    return params
  }



}
