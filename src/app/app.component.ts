import { Component, ViewChild , ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobTabComponent } from './components/job-tab/job-tab.component';
import { MatTabGroup } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None // Ensures global styles apply
})
export class AppComponent {
  title = 'dynamic-ag-grid';
  candidate_profile_table_name = "candidateprofile"
  job_table_name = "job"

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;
  @ViewChild(JobTabComponent, { static: false }) firstTab: JobTabComponent;

   
  isLoggedIn() {
  return this.auth.isLoggedIn();
}
  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {}

  login() {
    this.auth.login();
  }

  async callProtectedApi() {
    const token = await this.auth.getToken();
    if (token) {
      this.http.get('http://localhost:5000/hire', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        res => console.log('API success:', res),
        err => console.error('API error:', err)
      );
    } else {
      console.warn('No token available.');
    }
  }


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
}
