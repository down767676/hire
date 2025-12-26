import { Component, Inject, OnInit } from '@angular/core';
import { BaseTabComponent } from '../base-tab/base-tab.component';
import { PopupService } from '../../services/popup.service';
import { GenericDataService } from 'src/app/services/generic-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParamService } from 'src/app/services/param-service.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-candidate-search',
  templateUrl: './candidate-search.component.html',
  styleUrls: ['../base-tab/base-tab.component.css']
})
export class CandidateSearchComponent extends BaseTabComponent implements OnInit {

  public refreshCursor: boolean = false;
  public searchMetadata: any = null;

  api_end_point = "";
  sp = "";
  table_name = "candidatesearch";
  display_on_load = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected paramService: ParamService,
    protected dataService: GenericDataService,
    protected popupService: PopupService,
    private dataSharingService: DataSharingService
  ) {
    super(data, paramService, dataService, popupService, {
      "api_end_point": "",
      "sp": "",
      "table_name": "candidatesearch",
      "display_on_load": false
    });
  }

  ngOnInit(): void {
    this.dataSharingService.data$.subscribe(data => {
      if (data && Array.isArray(data)) {
        if (data.length > 0) {
          console.log(`CandidateSearch: Received ${data.length} candidates`);
          this.showGrid(data);
          this.searchMetadata = {
            count: data.length,
            timestamp: new Date(),
            source: 'ceipal'
          };
        } else {
          alert('No candidates found matching your search criteria.');
          this.searchMetadata = {
            count: 0,
            timestamp: new Date(),
            source: 'ceipal'
          };
        }
      }
    });
  }

  initializeFields(): void {
    this.setParentAttributes({
      "api_end_point": this.api_end_point,
      "sp": "",
      "table_name": "candidatesearch",
      "display_on_load": false
    });
  }

  onClickRefresh(): void {
    if (this.agGrid && this.agGrid.api) {
      this.refreshCursor = this.showWait(this.refreshCursor);
      this.agGrid.api.refreshCells({ force: true });
      this.refreshCursor = this.hideWait(this.refreshCursor);
    } else {
      alert('No search results to refresh. Please perform a search from the Jobs tab first.');
    }
  }

  getSearchSummary(): string {
    if (this.searchMetadata) {
      const time = this.searchMetadata.timestamp.toLocaleTimeString();
      return `${this.searchMetadata.count} candidates found at ${time}`;
    }
    return 'No search performed yet';
  }

  someMethod(): void {
    console.log('Implemented abstract method');
  }
}
