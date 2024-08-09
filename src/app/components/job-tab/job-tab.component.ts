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
import { DataSharingService} from 'src/app/services/data-sharing.service'

@Component({
  selector: 'app-jobtab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class JobTabComponent extends BaseTabComponent {


  someMethod(): void {
    console.log('Implemented abstract method');
  }


  initializeFields(): void {
    this.setParentAttributes({"api_end_point":"get_jobs", "sp":"", "table_name":"job", "display_on_load":true})
  }
  
  // component = JobTabComponent
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, protected paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService) {
    super(data, paramService, dataService, popupService, {"api_end_point":"get_jobs", "sp":"", "table_name":"job", "display_on_load":true});
  }


  // Method to get all rows with 'search' column set to 'yes'
  getIDsWithSearchYes() {
    const rowsWithSearchYes = [];
    const jobsWithYes = [];
    this.agGrid.api.forEachNode((node) => {
      if (node.data.search === 'yes') {
        rowsWithSearchYes.push(node.data);
        jobsWithYes.push(node.data.job_id);
      }
    });
    console.log(jobsWithYes);
    return jobsWithYes;
  }

  // Method to get all rows with 'search' column set to 'yes'
  getCheckedIDsWithSearchYes() {
    const rowsWithSearchYes = [];
    const jobsWithYes = [];
    this.agGrid.api.forEachNode((node) => {
      if (node.data.search === 'yes') {
        rowsWithSearchYes.push(node.data);
        jobsWithYes.push(node.data.job_id);
      }
    });
    console.log(jobsWithYes);
    return jobsWithYes;
  }

  searchAndSendData(api_end_point, sp, params): void {
    // const params = this.buildSearchParams();
    this.showWait();
      this.dataService.fetchDataPost(api_end_point, sp, params).subscribe(data => {
      this.dataSharingService.setData(data);
      this.changeTabEvent.emit(2);
      this.hideWait();
    });
  }
  
  @Output() changeTabEvent = new EventEmitter<number>();
  onClickSearchCandidates() {
    let params = this.getSearchCandididateParams()
    // this.searchAndOpenPopup("search_candidates", null, params, JobApplicationsPopupComponent)
    this.searchAndSendData("search_candidates", null, params);
    

  }

  getSearchCandididateParams(): any {
    let job_ids = this.extractCheckedIDs("job_id");
    let params = { "job_ids": job_ids, "minimum_should_match": 1 }
    return params
    
  }




}
