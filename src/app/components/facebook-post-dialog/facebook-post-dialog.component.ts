// facebook-post-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-facebook-post-dialog',
  templateUrl: './facebook-post-dialog.component.html',
  styleUrls: ['./facebook-post-dialog.component.css'],
})
export class FacebookPostDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { jobId: number; url: string }) {}
}
