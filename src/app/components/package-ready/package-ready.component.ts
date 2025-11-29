import { MatSelectChange } from '@angular/material/select';
import { Component, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service'
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { MatInputModule } from '@angular/material/input';
import { DialogComponent } from '../dialog/dialog.component'; // Adjust the path based on your setup

@Component({
  selector: 'app-package-ready',
  templateUrl: './package-ready.component.html',
  styleUrl: './package-ready.component.css'
})
export class PackageReadyComponent extends BaseTabComponent {

  public conversationCursor: boolean = false
  public refreshCursor: boolean = false
  public matchingCursor: boolean = false
  public matchingRecruiterCursor: boolean = false
  selectedMessageType: string = '';
  private apiUrl = environment.apiUrl;
  public max_radius = 25;
  public days_since_package_ready = 30;
  public onClickRefreshPackageReadysWaitCursor: boolean = false;

  public get_package_ready_url = `${this.apiUrl}/update-package-ready`;

  searchFields = ['field1', 'field2'];
  selectedOptions = ['', ''];
  api_end_point = "search_candidates";
  sp = "";
  table_name = "submissions";
  display_on_load = false
  public source_columns = ["all", "npi", "ceipal"];
  public selectedView: string = null
  public selected_source = this.source_columns[0]


  public normalizedTitleOptions = [
    "Medical Assistant",
    "RN Case Manager",
    "LPN"
  ]
  normalizedTitleOption: String = "Medical Assistant"

  distancetOption: String = '20'
  public distancetOptions = [
    '5', '10', '12', '15', '17', '20', '25', 'state', 'country'
  ]

  public employmentOptions = [
    "full time",
    "contract"
  ]
  employmentOption: String = "Medical Assistant"

  selectedTask: String = "TalkTo.5"
  public tasks = [
    { "code": "ReadyToSubmit.0", "value": "Ready to Submit" , "map":"package_ready"},
    { "code": "UpdateLastAvailableDates.1", "value": "Update Last Available Dates", "map":"package_ready_update_last_available" },
    { "code": "ResubmissionsHistory.1", "value": "Resubmissions History", "map":"package_ready" },

  ]

  someMethod(): void {
    console.log('Implemented abstract method');
  }

  // initializeFields(): void {
  //   this.setParentAttributes({ "api_end_point": "get_campaign", "sp": "", "table_name": "submissions", "display_on_load": true })
  // }
  initializeFields(): void {
    this.setParentAttributes({ "api_end_point": this.api_end_point, "sp": "", "table_name": "submissions", "display_on_load": true })

  }

  initializeFieldsForDialog(): void {
    this.setParentAttributes({ "api_end_point": "", "sp": "", "table_name": "submissions", "display_on_load": false })
  }


  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, paramService: ParamService, protected dataService: GenericDataService, protected popupService: PopupService, private dataSharingService: DataSharingService, public dialog: MatDialog) {
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
        selectedIds.push(row.data['submissions_id']);
      }
    })
    return selectedIds;
  }

  getJobSelectedIds(): number[] {
    const selectedIds: number[] = [];

    this.agGrid.api.forEachNode((row) => {
      if (row.data.selected === 'yes') {
        selectedIds.push(row.data['job_id']);
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
    if (this.tasks && this.tasks.length > 0) {
      this.selectedTask = this.tasks[0].code;
    }
    this.dataSharingService.data$.subscribe(data => {
      this.showGrid(data);
      // Optionally, perform any necessary logic with the received data
    });
  }


  onTaskChange(event: MatSelectChange) {
    this.go(this.selectedTask);
  }

  ngAfterViewInit(): void {
    this.go(this.selectedTask);
  }


  onClickRefreshPackageReady() {
        this.go(this.selectedTask);

    // this.refreshCursor = this.showWait(this.refreshCursor);
    // this.dataService.fetchDataPost('refresh-package-ready', null, { "days_since_package_ready": this.days_since_package_ready, "max_radius": this.max_radius }).subscribe(data => {
    //   this.showGrid(data);
    //   this.refreshCursor = this.hideWait(this.refreshCursor);
    // })

    // // let params = this.getSearchCandididateParams()
    // this.go(this.selectedTask);
  }


  onClickUpdatePackageReady() {
    // Open dialog with title and content
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Update Re-Submission List',
        content: 'This will be complete in about 10-15 minutes. Refresh Package Ready Page After 15 minutes',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.fetchDataPost('update-package-ready', null, {
          days_since_package_ready: 30,
          max_radius: 30,
        }).subscribe((data) => {
          this.showGrid(data);
        });
      } else {
        console.log('User canceled the action');
      }
    }); // <-- properly closed here
  }

    go(selectedTask) {
    const task = this.tasks.find(task => task.code === this.selectedTask);
    let secondaryDropdownValue = task ? task.map : '';

    if (this.isValid(selectedTask)) {
      this.onClickRefreshPackageReadysWaitCursor = this.showWait(this.onClickRefreshPackageReadysWaitCursor);

      this.dataService.fetchDataPost('package-ready', null, { 'task': selectedTask ,"days_since_package_ready": this.days_since_package_ready, "max_radius": this.max_radius }).subscribe(data => {
        this.agGrid.setSelectedView(secondaryDropdownValue)
        this.showGrid(data);
        this.onClickRefreshPackageReadysWaitCursor = this.hideWait(this.onClickRefreshPackageReadysWaitCursor);

      })
    }
  }


  // go(selectedTask) {
  //   if (this.isValid(selectedTask)) {
  //     this.refreshCursor = this.showWait(this.refreshCursor);
  //     this.dataService.fetchDataPost('refresh-package-ready', null, { "days_since_package_ready": 30, "max_radius": 30 }).subscribe(data => {
  //       this.showGrid(data);
  //       this.refreshCursor = this.hideWait(this.refreshCursor);
  //     })
  //   }
  // }

}
