import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  template: `
    <h1 mat-dialog-title>Search Web Registry</h1>
    <div mat-dialog-content>
      <p>Your search will be complete in 10-60 minutes or depending on number of jobs searched. First job should be searched in less than 10 minutes.
        
      You can keep checking by 1) Click Refresh Grid Button 2) Change the view to Searches 3) Check the Total Found column for each job </p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">OK</button>
    </div>
  `,
})
export class DialogComponent {
  constructor(public dialogRef: MatDialogRef<DialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
