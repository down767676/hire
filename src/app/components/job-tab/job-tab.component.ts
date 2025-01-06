// src/app/components/tab1/tab1.component.ts
import { ConversationDialogComponent } from '../../components/conversation-dialog/conversation-dialog.component'
import { Component, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { ParamService } from 'src/app/services/param-service.service';
import { GenericDataService } from 'src/app/services/generic-data.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service'
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component'; // Adjust the path based on your setup
import { MatSelectChange } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-jobtab',
  templateUrl: './job-tab.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class JobTabComponent extends BaseTabComponent {

  private apiUrl = environment.apiUrl;
  jobs_receiver_url = `${this.apiUrl}/receive_jobs`;

  public onClickSearchCandidatesWaitCursor: boolean = false;
  public onClickSearchCeipalJobsWaitCursor: boolean = false;

  public onClickClusterJobsWaitCursor: boolean = false;
  public onClickRefreshJobsWaitCursor: boolean = false;
  public source_columns = ["ceipal"];

  public selectedView: string = null
  public selected_source = this.source_columns[0]

  dropdownMapping = {
    'Option1': ['SubOption1.1', 'SubOption1.2'],
    'Option2': ['SubOption2.1', 'SubOption2.2'],
    'Option3': ['SubOption3.1', 'SubOption3.2']
  };

  selectedTask: String = "All.30"
  public tasks = [
    { "code": "All.1", "value": "All Jobs in last 1 days", "map":"job"},
    { "code": "All.2", "value": "All Jobs in last 2 days", "map":"job"},
    { "code": "All.3", "value": "All Jobs in last 3 days" , "map":"job"},
    { "code": "All.4", "value": "All Jobs in last 4 days", "map":"job" },
    { "code": "All.5", "value": "All Jobs in last 5 days", "map":"job" },
    { "code": "All.6", "value": "All Jobs in last 6 days", "map":"job" },
    { "code": "All.7", "value": "All Jobs in last 7 days", "map":"job" },
    { "code": "All.10", "value": "All Jobs in last 10 days", "map":"job" },
    { "code": "All.12", "value": "All Jobs in last 12 days", "map":"job" },
    { "code": "All.15", "value": "All Jobs in last 15 days", "map":"job" },
    { "code": "All.30", "value": "All Jobs in last 30 days", "map":"job" },
    { "code": "All.60", "value": "All Jobs in last 60 days", "map":"job" },
    { "code": "All.90", "value": "All Jobs in last 90 days", "map":"job" },
    { "code": "All.365", "value": "All Jobs in last 365 days", "map":"job_text_history" },
    { "code": "Texted.1", "value": "Texted in last 1 days", "map":"job_text_history" },
    { "code": "Texted.2", "value": "Texted in last 2 days", "map":"job_text_history" },
    { "code": "Texted.3", "value": "Texted in last 3 days", "map":"job_text_history" },
    { "code": "Texted.4", "value": "Texted in last 4 days", "map":"job_text_history" },
    { "code": "Texted.5", "value": "Texted in last 5 days", "map":"job_text_history" },
    { "code": "Texted.6", "value": "Texted in last 6 days", "map":"job_text_history" },
    { "code": "Texted.7", "value": "Texted in last 7 days", "map":"job_text_history" },
    { "code": "Texted.10", "value": "Texted in last 10 days", "map":"job_text_history" },
    { "code": "Texted.12", "value": "Texted in last 12 days", "map":"job_text_history" },
    { "code": "Texted.15", "value": "Texted in last 15 days", "map":"job_text_history" },
    { "code": "Texted.30", "value": "Texted in last 30 days", "map":"job_text_history" },
    { "code": "Texted.60", "value": "Texted in last 60 days", "map":"job_text_history" },
    { "code": "Texted.90", "value": "Texted in last 90 days", "map":"job_text_history" },
    { "code": "Texted.365", "value": "Texted in last 365 days", "map":"job_text_history" },
    { "code": "TextPipeline.pipeline", "value": "Text Pipeline", "map":"job_text_pipeline" },
    { "code": "TextPipeline.nearby", "value": "Nearby Job Text Pipeline", "map":"job_text_pipeline" },
    { "code": "TextPipeline.travel", "value": "Travel Text Pipeline", "map":"job_text_pipeline" },
    { "code": "TextPipeline.nearby_full_time", "value": "Nearby Fulltime Pipeline", "map":"job_text_pipeline" },
    { "code": "TextPipeline.full_time", "value": "Fulltime Pipeline", "map":"job_text_pipeline" },
    { "code": "TextPipeline.pipeline_include_texted", "value": "Include Texted - Text Pipeline", "map":"job_text_pipeline" },
    { "code": "TextPipeline.nearby_include_texted", "value": "Include Texted - Nearby Pipeline", "map":"job_text_pipeline" },
  ]


  // Handle the emitted JSON and modify it
  handleCsvData(csvData: any): void {
    console.log('Received JSON:', csvData);

    const payload = {}
    payload['source'] = 'aya'
    payload['jobs'] = csvData
    // // Modify the JSON (e.g., add a timestamp)
    // csvData.timestamp = new Date().toISOString();

    // // Add or modify fields as needed
    // csvData.metadata = { processedBy: 'Parent Component' }; // Add metadata

    // Send the modified JSON to the backend
    this.sendToBackend(payload);
  }

  // Send the JSON to the backend
  private sendToBackend(data: any): void {
    this.http.post(this.jobs_receiver_url, data).subscribe({
      next: (response) => {
        console.log('Data sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending data:', error);
      }
    });
  }

  someMethod(): void {
    console.log('Implemented abstract method');
  }

  showJobView(selectedViewName: string) {
    this.showView(selectedViewName)
  }

  ngOnInit() {
    this.communicationService.callJobTabShowView$.subscribe((selectedView: any) => {
      this.showJobView(selectedView);
    });
  }

  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": "get_ceipal_jobs", "sp": "", "table_name": "job", "display_on_load": true })

  }

  // component = JobT abComponent
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, protected paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog, private communicationService: CommunicationService, private http: HttpClient) {
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
    // Open dialog with title and content
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Search Web Registry',
        content: 'Your search will be complete in 10-60 minutes depending on the number of jobs searched. The first job should be searched in less than 10 minutes. You can keep checking by: 1) Clicking the Refresh Grid Button, 2) Changing the view to Searches, 3) Checking the Total Found column for each job.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // OK button was clicked
        let params = this.getSearchNPIParams();
        this.searchAndSendDataFireAndForget("search_candidates", null, params);
      } else {
        // Cancel button was clicked
        console.log('User canceled the action');
      }
    });
  }

  onClickGetCeipalJobs() {
    this.onClickSearchCeipalJobsWaitCursor = this.showWait(this.onClickSearchCeipalJobsWaitCursor);
    this.dataService.fetchDataPost('upsert_ceipal_jobs', null, { "days": "30" }).subscribe(data => {
      this.onClickSearchCeipalJobsWaitCursor = this.hideWait(this.onClickSearchCeipalJobsWaitCursor);
    })
  }


  onClickSmartSearch() {
    // Open dialog with title and content
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Search Job',
        content: 'Your search of web registry and Ceipal will be complete in about 10-60 minutes depending on the number of jobs searched. The first job should be searched in less than 10 minutes. You can keep checking by: 1) Clicking the Refresh Grid Button, 2) Changing the view to Searches, 3) Checking the Total Found column for each job.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // OK button was clicked
        let params = this.getSearchNPIParams();
        this.searchAndSendDataFireAndForget("smart_search", null, params);
      } else {
        // Cancel button was clicked
        console.log('User canceled the action');
      }
    });
  }


  onClickPostToCeipal() {
    this.dataService.fetchDataPost('post_jobs_to_ceipal', null, {}).subscribe(data => {
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


  matchMissingClassification() {

    this.dataService.fetchDataPost('update_nucc_classification', null, {}).subscribe(data => {
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

  copyNuccClassificationToFilteredRows() {
    let selectedRowWithYes = null;
    let countOfYes = 0;

    // Iterate over all nodes after the filter is applied
    this.agGrid.api.forEachNodeAfterFilter(node => {
      if (node.data.copy_from === 'yes') {
        countOfYes++;
        selectedRowWithYes = node;
      }
    });

    // If there is more than one 'yes', show an alert and do not copy
    if (countOfYes > 1) {
      alert("More than one row with 'selected' set to 'yes'. Cannot proceed.");
      return;
    }

    // If no row with 'selected' = 'yes', do nothing
    if (countOfYes === 0) {
      alert("No row with 'copy_from' set to 'yes'.");
      return;
    }

    // Get the nucc_classification value from the row with 'selected' = 'yes'
    const nuccClassificationToCopy = selectedRowWithYes.data.nucc_classification;

    // Copy the nucc_classification to other filtered rows where it is blank
    this.agGrid.api.forEachNodeAfterFilter(node => {
      if (node !== selectedRowWithYes && !node.data.nucc_classification) {
        node.setDataValue('nucc_classification', nuccClassificationToCopy);
      }
    });

    selectedRowWithYes.setDataValue('copy_from', null)

    // Refresh the grid to show the updated data
    this.agGrid.api.refreshCells();
  }

  showJobsByDistance() 
  {
    this.showJobsByDistance_sub('candidate')
  }

  getMobileSelectedIds(): number[] {
    const selectedIds: number[] = [];

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['job_id']);
      }
    })
    return selectedIds;
  }

  onTaskChange(event: MatSelectChange) {
    this.go(this.selectedTask);
  }

  go(selectedTask) {
    const task = this.tasks.find(task => task.code === this.selectedTask);
    let secondaryDropdownValue = task ? task.map : '';

    if (this.isValid(selectedTask)) {
      this.onClickRefreshJobsWaitCursor = this.showWait(this.onClickRefreshJobsWaitCursor);

      this.dataService.fetchDataPost('get_job_statistics', null, { 'task': selectedTask }).subscribe(data => {
        this.showGrid(data);
        this.onClickRefreshJobsWaitCursor = this.hideWait(this.onClickRefreshJobsWaitCursor);
        this.agGrid.setSelectedView(secondaryDropdownValue)

      })
    }
  }
  showJobsByDistance_sub(level) {
    var ids = this.getMobileSelectedIds()

    if (ids.length > 1) {
      alert('Error: More than one row has the value "yes"');
      return;
    } else if (ids.length === 0) {
      alert('No row with "yes" selected');
      return;
    }
    this.dataService.fetchDataPost('get_matching_jobs_str_from_job', null, { 'job_id': ids[0], 'level':level }).subscribe(data => {
      if (data) {
        this.dialog.open(ConversationDialogComponent, {
          data: { conversationHistory: data },
          width: '70vw', // Adjust as needed
          maxWidth: '70vw', // Prevents it from shrinking below this width
          height: '70vh', // Adjust as needed for height        
        });
      } else {
        alert("No data found");
      }
        
    })
  }


}
