import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-html-dialog',
  template: `
    <h2 mat-dialog-title>Edit Description</h2>
    <mat-dialog-content>
      <textarea [(ngModel)]="data.value" rows="10" style="width: 100%;"></textarea>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `
})
export class EditHtmlDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditHtmlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { value: string }
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.data.value);
  }
}
