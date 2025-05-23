import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { JobTabComponent } from '../job-tab/job-tab.component';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements AfterViewInit {
  candidate_profile_table_name = "candidateprofile";
  job_table_name = "job";

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;
  @ViewChild(JobTabComponent, { static: false }) firstTab: JobTabComponent;

  hovering = false;

// logout() {
//   this.msalService.logoutRedirect(); // or logoutPopup()
// }


  constructor(private auth: AuthService) {}

  ngAfterViewInit() {
    if (this.firstTab?.changeTabEvent) {
      this.firstTab.changeTabEvent.subscribe((tabNumber: number) => {
        this.selectTab(tabNumber);
      });
    } else {
      console.warn('firstTab is undefined – cannot bind to changeTabEvent yet');
    }
  }

  selectTab(index: number) {
    this.tabs.selectedIndex = index;
  }

  logout() {
    this.auth.logout();
  }
}
