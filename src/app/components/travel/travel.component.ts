// travel.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from 'src/app/services/generic-data.service';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css'],
})
export class TravelComponent implements OnInit {
  @Input() jobId!: number;
  @Input() TravelUrl!: string;
  postContent: string = '';

  constructor(private http: HttpClient, protected dataService: GenericDataService) {}

  ngOnInit(): void {
    if (this.jobId && this.TravelUrl) {
      this.getTravel(this.jobId, this.TravelUrl);
    } else {
      console.error('jobId or TravelUrl is missing.');
    }
  }

  getTravel(jobId: number, url: string): void {
    const apiUrl = `${url}?job_id=${jobId}`;
    this.dataService.fetchData('generate-travel-report', null, {'job_id':jobId}).subscribe(data => {
      this.postContent = data;
    });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.postContent).then(
      () => alert('Copied to clipboard!'),
      (err) => alert('Failed to copy: ' + err)
    );
  }
}
