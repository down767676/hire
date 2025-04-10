// facebook-post.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from 'src/app/services/generic-data.service';

@Component({
  selector: 'app-facebook-post',
  templateUrl: './facebook-post.component.html',
  styleUrls: ['./facebook-post.component.css'],
})
export class FacebookPostComponent implements OnInit {
  @Input() jobId!: number;
  @Input() facebookPostUrl!: string;
  postContent: string = '';

  constructor(private http: HttpClient, protected dataService: GenericDataService) {}

  ngOnInit(): void {
    if (this.jobId && this.facebookPostUrl) {
      this.getFacebookPost(this.jobId, this.facebookPostUrl);
    } else {
      console.error('jobId or facebookPostUrl is missing.');
    }
  }

  getFacebookPost(jobId: number, url: string): void {
    const apiUrl = `${url}?job_id=${jobId}`;
    this.dataService.fetchData('generate-travel-report', null, {'job_id':jobId}).subscribe(data => {
      this.postContent = data;
    });

    // this.http.get<{ post: string }>(apiUrl).subscribe({
    //   next: (response) => {
    //     this.postContent = response.post;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching Facebook post', err);
    //   },
    // });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.postContent).then(
      () => alert('Copied to clipboard!'),
      (err) => alert('Failed to copy: ' + err)
    );
  }
}
