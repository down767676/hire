import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobTabComponent } from './components/job-tab/job-tab.component';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'dynamic-ag-grid';
  candidate_profile_table_name = "candidateprofile"
  job_table_name = "job"

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;
  @ViewChild(JobTabComponent, { static: false }) firstTab: JobTabComponent;

  ngAfterViewInit() {
    this.firstTab.changeTabEvent.subscribe((tabNumber: number) => {
      this.selectTab(tabNumber);
    });
  }

  selectTab(index: number) {
    this.tabs.selectedIndex = index;
  }
}

