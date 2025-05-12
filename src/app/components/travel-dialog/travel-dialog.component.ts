// travel-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-travel-dialog',
  templateUrl: './travel-dialog.component.html',
  styleUrls: ['./travel-dialog.component.css'],
})
export class TravelDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { jobId: number; url: string }) {}
}
