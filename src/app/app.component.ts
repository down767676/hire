import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'dynamic-ag-grid';
  candidate_profile_table_name = "candidateprofile"
  job_table_name = "job"
}

